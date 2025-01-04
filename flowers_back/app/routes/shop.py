from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.shop import Shop
from app.models.product import Product
from app.schemas.shop import ShopResponse
from app.schemas.product import ProductResponse
import os 
import uuid
from .auth import get_current_user

router = APIRouter()  # Перенесено в начало файла

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# для админа
@router.post("/", response_model=ShopResponse)
async def create_shop(
    request: Request,
    user: dict = Depends(get_current_user),
    subdomain: str = Form(...),
    color: str = Form(...),
    logo: UploadFile = None,
    db: Session = Depends(get_db)
):
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
        logo_url=logo_url
    )
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)

    return new_shop

@router.get("/", response_model=list[ShopResponse])
def get_shops(
    request: Request, user: dict = Depends(get_current_user), db: Session = Depends(get_db)
):
    shops = db.query(Shop).all()
    if not shops:
        raise HTTPException(status_code=404, detail="Нет магазинов")

    base_url = str(request.base_url)
    return [
        ShopResponse(
            id=shop.id,
            subdomain=shop.subdomain,
            primary_color=shop.primary_color,
            logo_url=f"{base_url}static/uploads/{shop.logo_url}" if shop.logo_url else None
        )
        for shop in shops
    ]

@router.get("/subdomain", response_model=ShopResponse)
def get_shop_by_id(
    request: Request, db: Session = Depends(get_db)
):
    host = request.headers.get("host", "")
    subdomain = host.split(".")[0]
    
    shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")
    
    base_url = str(request.base_url)
    return ShopResponse(
        id=shop.id,
        subdomain=shop.subdomain,
        primary_color=shop.primary_color,
        logo_url=f"{base_url}static/uploads/{shop.logo_url}" if shop.logo_url else None,
    )

@router.get("/{shop_id}", response_model=ShopResponse)
def get_shop_by_id(
    shop_id: int, request: Request, db: Session = Depends(get_db)
):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    base_url = str(request.base_url)
    return ShopResponse(
        id=shop.id,
        subdomain=shop.subdomain,
        primary_color=shop.primary_color,
        logo_url=f"{base_url}static/uploads/{shop.logo_url}" if shop.logo_url else None,
    )

@router.put("/{shop_id}")
async def update_shop(
    shop_id: int,
    user: dict = Depends(get_current_user),
    subdomain: str = Form(...),
    color: str = Form(...),
    logo: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    shop.subdomain = subdomain
    shop.primary_color = color

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
        photo_url=product.photo_url if product.photo_url else None,
    )

@router.post("/{shop_id}/products", response_model=ProductResponse)
async def create_product(
    shop_id: int,
    name: str = Form(...),
    price: str = Form(...),
    category_id: int = Form(...),
    description: str = Form(""),
    ingredients: str = Form(""),
    image: UploadFile = None,
    db: Session = Depends(get_db),
):
    # Преобразуем цену в число
    price = int(price, 10)
    
    # Обработка изображения
    if image:
        # Проверяем и создаем директорию, если она не существует
        os.makedirs("static/uploads", exist_ok=True)

        # Генерация уникального имени файла
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Сохранение файла
        with open(save_path, "wb") as f:
            f.write(await image.read())

        # Генерация URL для сохраненного файла
        photo_url = unique_filename
    else:
        photo_url = None

    # Создание нового продукта
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
    price: str = Form(...),
    ingredients: Optional[str] = Form(None),
    image: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
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

@router.delete("/{shop_id}/products/{product_id}")
def delete_product(
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

    db.delete(product)
    db.commit()
    return {"detail": "Продукт удален"}
