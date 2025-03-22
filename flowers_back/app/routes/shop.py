import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form, Request
from pydantic import HttpUrl
from sqlalchemy.orm import Session

import app.repositories.categories
from app.core.config import CATEGORY_IMAGE_RETRIEVAL_DIR
from app.core.database import get_db
from app.dependencies.Orders import DeliveryDistanceServiceDep
from app.dependencies.Shops import ShopDeliveryCostResponse, ShopDeliveryCostCreate
from app.models.category import Category
from app.models.shop import Shop
from app.models.user import User
from app.models.product import Product
from app.repositories import shop as shop_repository
from app.schemas.category import CategoryResponse
from app.schemas.shop import ShopResponse, OwnerShopResponse
from app.schemas.product import ProductResponse
import os
import uuid
from app.routes.admin import get_current_user
from sqlalchemy import text
from typing import List, Dict

from app.services.Shop import create_shop_delivery_cost

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=ShopResponse)
async def create_shop(
    request: Request,
    user: dict = Depends(get_current_user),
    subdomain: str = Form(...),
    color: str = Form(...),
    inn: str = Form(...),
    phone: str = Form(...),
    logo: UploadFile = None,
    addresses: str = Form(...),
    db: Session = Depends(get_db),
    security=[{"BearerAuth": []}]
):
    find_user = db.query(User).filter(User.id == user.id).first()

    if not find_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if find_user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено создавать новые магазины")

    existing_shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
    if existing_shop:
        raise HTTPException(status_code=400, detail="Поддомен уже существует")

    if logo:
        file_extension = logo.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        save_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            f.write(await logo.read())

        logo_url = unique_filename
    else:
        logo_url = None

    new_shop = Shop(
        subdomain=subdomain,
        primary_color=color,
        inn=inn,
        phone=phone,
        addresses=addresses,
        logo_url=logo_url,
        owner_id=find_user.id
    )
    if addresses:
        try:
            import json
            addresses_list = json.loads(addresses)
            new_shop.addresses = addresses_list
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Невалидный формат для адресов: {str(e)}")

    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)

    base_url = str(request.base_url)
    return ShopResponse(
        id=new_shop.id,
        subdomain=new_shop.subdomain,
        primary_color=new_shop.primary_color,
        inn=new_shop.inn,
        phone=new_shop.phone,
        addresses=new_shop.addresses,
        logo_url=f"{base_url}static/uploads/{new_shop.logo_url}" if new_shop.logo_url else None
    )

@router.get("/", response_model=list[ShopResponse])
def get_shops(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    shops = db.query(Shop).filter(Shop.owner_id == current_user.id).all()

    if not shops:
        raise HTTPException(status_code=404, detail="Нет магазинов для данного пользователя")

    base_url = str(request.base_url)
    list_of_shops = []
    for shop in shops:
        addresses = []
        if shop.addresses:
            try:
                addresses = shop.addresses
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Невалидный формат для адресов: {str(e)}")
        list_of_shops.append(ShopResponse(
            id=shop.id,
            subdomain=shop.subdomain,
            primary_color=shop.primary_color,
            inn=shop.inn,
            phone=shop.phone,
            addresses=addresses,
            logo_url=f"{base_url}static/uploads/{shop.logo_url}" if shop.logo_url else None
        ))

    return list_of_shops

@router.get("/user/{telegram_id}", response_model=list[OwnerShopResponse])
async def get_by_owner(telegram_id: str, request: Request, db: Session = Depends(get_db)):
    user_id = get_user_id_by_tg_id(telegram_id, db)

    shops = db.query(Shop).filter(Shop.owner_id == user_id).all()

    if not shops:
        logging.error("No shops found for this user: " + telegram_id)
        raise HTTPException(status_code=404, detail="No shops found for this user")

    return [
        OwnerShopResponse(
            id=shop.id,
            subdomain=shop.subdomain
        ) for shop in shops
    ]

@router.get("/subdomain", response_model=ShopResponse)
def get_shop_by_domain(
    request: Request, db: Session = Depends(get_db)
):
    subdomain = request.headers.get("X-Subdomain")
    if not subdomain:
        raise HTTPException(status_code=400, detail="Subdomain header is required")

    shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    addresses = []
    if shop.addresses:
        try:
            addresses = shop.addresses
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Невалидный формат для адресов: {str(e)}")


    base_url = str(request.base_url)
    return ShopResponse(
        id=shop.id,
        subdomain=shop.subdomain,
        primary_color=shop.primary_color,
        inn=shop.inn,
        phone=shop.phone,
        addresses=addresses,
        logo_url=f"{base_url}static/uploads/{shop.logo_url}" if shop.logo_url else None,
    )

@router.get("/{shop_id}", response_model=ShopResponse)
def get_shop_by_id(
    shop_id: int, request: Request, db: Session = Depends(get_db)
):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    addresses = []
    if shop.addresses:
        try:
            addresses = shop.addresses
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Невалидный формат для адресов: {str(e)}")

    base_url = str(request.base_url)
    return ShopResponse(
        id=shop.id,
        subdomain=shop.subdomain,
        primary_color=shop.primary_color,
        inn=shop.inn,
        phone=shop.phone,
        addresses=addresses,
        logo_url=f"{base_url}static/uploads/{shop.logo_url}" if shop.logo_url else None,
    )

@router.put("/{shop_id}")
async def update_shop(
    shop_id: int,
    user: dict = Depends(get_current_user),
    subdomain: str = Form(...),
    color: str = Form(...),
    inn: str = Form(...),
    phone: str = Form(...),
    logo: Optional[UploadFile] = None,
    addresses: str = Form(...),
    db: Session = Depends(get_db),
):
    find_user = db.query(User).filter(User.id == user.id).first()
    print(addresses)
    if not find_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if find_user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено обновлять магазины")

    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    shop.subdomain = subdomain
    shop.primary_color = color
    shop.inn = inn
    shop.phone = phone
    shop.address = addresses

    if addresses:
        try:
            import json
            addresses_list = json.loads(addresses)
            shop.addresses = addresses_list
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Невалидный формат для адресов: {str(e)}")

    if logo:
        file_extension = logo.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join("uploads", unique_filename)

        with open(save_path, "wb") as f:
            f.write(await logo.read())
        shop.logo_url = unique_filename

    db.commit()
    db.refresh(shop)
    return shop

@router.delete("/{shop_id}")
def delete_shop(shop_id: int, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    find_user = db.query(User).filter(User.id == user.id).first()

    if not find_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if find_user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено удалять магазины")

    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")
    db.delete(shop)
    db.commit()
    return {"detail": "Магазин удален"}


# === Ручки для продуктов ===

@router.get("/{shop_id}/products", response_model=list[ProductResponse])
def get_products(
    request: Request,
    shop_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    products = db.query(Product).filter(Product.shop_id == shop_id).all()
    if not products:
        raise HTTPException(status_code=404, detail="Продукты не найдены")

    base_url = str(request.base_url)
    return [
        ProductResponse(
            id=product.id,
            name=product.name,
            price=product.price,
            description=product.description,
            ingredients=product.ingredients,
            photo_url=f"{base_url}static/uploads/{product.photo_url}" if product.photo_url else None
        )
        for product in products
    ]

@router.get("/{shop_id}/products/{product_id}", response_model=ProductResponse)
def get_product(
    shop_id: int,
    product_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    product = db.query(Product).filter(
        Product.shop_id == shop_id, Product.id == product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")

    return ProductResponse(
        id=product.id,
        name=product.name,
        price=product.price,
        description=product.description,
        ingredients=product.ingredients,
        categoryId=product.category_id,
        photo_url=product.photo_url if product.photo_url else None,
        availability=product.availability
    )

@router.post("/{shop_id}/products", response_model=ProductResponse)
async def create_product(
    shop_id: int,
    name: str = Form(...),
    price: str = Form(...),
    category_id: int = Form(...),
    availability: Optional[str] = Form(None),
    description: str = Form(""),
    ingredients: str = Form(""),
    image: UploadFile = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    find_user = db.query(User).filter(User.id == user.id).first()

    if not find_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if find_user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено создавать новые продукты")

    price = int(price, 10)

    if image:
        os.makedirs("static/uploads", exist_ok=True)

        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            f.write(await image.read())

        photo_url = unique_filename
    else:
        photo_url = None

    new_product = Product(
        shop_id=shop_id,
        name=name,
        price=price,
        category_id=category_id,
        description=description,
        ingredients=ingredients,
        photo_url=photo_url,
        availability=availability
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

def get_user_id_by_tg_id(user_tg_id: str, db: Session):
    user = db.execute(
        text('''
                    SELECT * FROM Users u
                    WHERE u.telegram_ids @> :telegram_id
                '''),
        {"telegram_id": f'["{user_tg_id}"]'}
    ).fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден! Видимо вам запрещено создавать продукты")

    if user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено создавать новые продукты")

    return user.id

@router.post("/telegram/{shop_id}/products", response_model=ProductResponse)
async def create_product_from_telegram(
        shop_id: int,
        name: str = Form(...),
        price: str = Form(...),
        category_id: int = Form(...),
        description: str = Form(""),
        ingredients: str = Form(""),
        image: UploadFile = None,
        user_tg_id: str = Form(...),
        db: Session = Depends(get_db)
):
    get_user_id_by_tg_id(user_tg_id, db)

    price = int(price, 10)

    if image:
        os.makedirs("static/uploads", exist_ok=True)

        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            f.write(await image.read())

        photo_url = unique_filename
    else:
        photo_url = None

    new_product = Product(
        shop_id=shop_id,
        name=name,
        price=price,
        category_id=category_id,
        description=description,
        ingredients=ingredients,
        photo_url=photo_url,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.put("/{shop_id}/products/{product_id}", response_model=ProductResponse)
async def update_product(
    request: Request,
    shop_id: int,
    product_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    availability: Optional[str] = Form(None),
    price: str = Form(...),
    ingredients: Optional[str] = Form(None),
    image: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    find_user = db.query(User).filter(User.id == user.id).first()

    if not find_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if find_user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено создавать обновлять продукты")

    price = int(price, 10)
    product = db.query(Product).filter(
        Product.shop_id == shop_id, Product.id == product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")

    product.name = name
    product.description = description
    product.price = price
    product.ingredients = ingredients
    product.category_id = category_id
    product.availability = availability

    if image:
        os.makedirs("static/uploads", exist_ok=True)
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            f.write(await image.read())

        product.photo_url = unique_filename

    db.commit()
    db.refresh(product)
    return product


@router.get("/{shop_id}/categories", response_model=list[CategoryResponse])
def get_shop_categories(
        request: Request,
        shop_id: int,
        db: Session = Depends(get_db),
):
    categories = app.repositories.categories.get_categories_by_shop_id(shop_id=shop_id, db=db)
    return [CategoryResponse(
        id=category.id,
        name=category.name,
        value=category.value,
        imageUrl=HttpUrl(f"{request.base_url}{category.image_url}"),
    ) for category in categories]




@router.post("/{shop_id}/categories")
def add_shop_categories(
        request: Request,
        shop_id: int,
        category_list: list[int],
        db: Session = Depends(get_db),
        user: User = Depends(get_current_user)
    ):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="У вас нет доступа к этому магазину")
    shop_repository.add_shop_categories(db=db, categories=category_list, shop_id=shop_id)
    categories = app.repositories.categories.get_categories_by_shop_id(db=db, shop_id=shop.id)
    return [CategoryResponse(
        id=category.id,
        name=category.name,
        value=category.value,
        imageUrl=HttpUrl(f"{request.base_url}{category.image_url}"),
    ) for category in categories]

@router.delete("/{shop_id}/categories/{category_id}")
def delete_category_from_shop(
        shop_id: int,
        category_id: int,
        db: Session = Depends(get_db),
        user: User = Depends(get_current_user)
):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="У вас нет доступа к этому магазину")

    shop_repository.delete_shop_category(db=db, shop_id=shop_id, category_id=category_id)
    return {"detail": "Категория удалена"}

@router.post("/{shop_id}/categories/{category_id}")
def add_category_to_shop(
        shop_id: int,
        category_id: int,
        db: Session = Depends(get_db),
        user: User = Depends(get_current_user)
):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="У вас нет доступа к этому магазину")

    shop_repository.add_shop_category(db=db, shop_id=shop_id, category_id=category_id)
    return {"detail": "Категория добавлена"}

@router.delete("/{shop_id}/products/{product_id}")
def delete_product(
        shop_id: int,
        product_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(get_current_user)
):
    # Проверка пользователя
    find_user = db.query(User).filter(User.id == user.id).first()

    if not find_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if find_user.is_removed:
        raise HTTPException(status_code=403, detail="Пользователю запрещено удалять продукты")

    # Проверка продукта
    product = db.query(Product).filter(
        Product.shop_id == shop_id, Product.id == product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")

    # Удаление файла изображения
    if product.photo_url:
        file_path = os.path.join(UPLOAD_DIR, product.photo_url)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Файл {file_path} успешно удален.")
            else:
                print(f"Файл {file_path} не найден, возможно, он уже был удален.")
        except Exception as e:
            print(f"Ошибка при удалении файла {file_path}: {e}")
            raise HTTPException(status_code=500, detail="Ошибка при удалении файла продукта")

    # Удаление продукта из базы данных
    db.delete(product)
    db.commit()
    return {"detail": "Продукт удален"}


@router.get("/{shop_id}/delivery/cost", response_model=ShopDeliveryCostResponse, tags=["Shops", "Delivery"])
def get_shop_delivery_cost(
    shop_id: int,
    db: Session = Depends(get_db),
):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if not shop or not shop.delivery_cost:
        raise HTTPException(status_code=404, detail="Доставка не найдена")

    return ShopDeliveryCostResponse(
        type=shop.delivery_cost.type,
        fixed_cost=shop.delivery_cost.fixed_cost,
        radius_cost=shop.delivery_cost.radius_cost
    )
from app.services import Shop as ShopServices
@router.post("/{shop_id}/delivery/cost/calculate", tags=["Shops", "Delivery"])
def calculate_shop_delivery_cost(
    shop_id: int,
    delivery_distance_services: DeliveryDistanceServiceDep,
    db: Session = Depends(get_db),
):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if not shop or not shop.delivery_cost:
        raise HTTPException(status_code=404, detail="Доставка не найдена")
    elif shop.delivery_cost.fixed_cost:
        return shop.delivery_cost.fixed_cost
    else:
        smallest_distance = None
        for shop_address in shop.addresses:
            distance = delivery_distance_services.calculate_delivery_distance(shop_address.get("address"))
            if smallest_distance is None or smallest_distance > distance:
                smallest_distance = distance
        return ShopServices.calculate_delivery_cost(delivery_cost=shop.delivery_cost, distance=smallest_distance)

@router.post("/{shop_id}/delivery/cost", response_model=ShopDeliveryCostResponse, tags=["Shops", "Delivery"])
def create_shop_delivery_cost(
    shop_id: int,
    delivery_cost: ShopDeliveryCostCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")
    if shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="У вас нет доступа к этому магазину")
    if shop.delivery_cost:
        raise HTTPException(status_code=400, detail="Доставка уже создана")
    if shop_repository.get_shop_delivery_cost(shop_id=shop_id, db=db):
        raise HTTPException(status_code=400, detail="Доставка уже создана")
    new_delivery_cost = shop_repository.create_shop_delivery_cost(db=db, shop_id=shop_id, delivery_cost=delivery_cost)
    db.add(new_delivery_cost)
    db.commit()
    db.refresh(new_delivery_cost)

    return ShopDeliveryCostResponse(
        type=new_delivery_cost.type,
        fixed_cost=new_delivery_cost.fixed_cost,
        radius_cost=new_delivery_cost.radius_cost
    )

@router.put("/{shop_id}/delivery/cost", response_model=ShopDeliveryCostResponse, tags=["Shops", "Delivery"])
def update_shop_delivery_cost(
    shop_id: int,
    delivery_cost: ShopDeliveryCostCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    shop = shop_repository.get_shop_by_id(shop_id=shop_id, db=db)
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")
    if shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="У вас нет доступа к этому магазину")
    if not shop.delivery_cost:
        raise HTTPException(status_code=404, detail="Доставка не найдена")

    new_delivery_cost = shop_repository.update_shop_delivery_cost(db=db, shop_id=shop_id, delivery_cost=delivery_cost)
    db.add(new_delivery_cost)
    db.commit()
    db.refresh(new_delivery_cost)

    return ShopDeliveryCostResponse(
        type=new_delivery_cost.type,
        fixed_cost=new_delivery_cost.fixed_cost,
        radius_cost=new_delivery_cost.radius_cost
    )