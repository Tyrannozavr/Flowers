from fastapi import APIRouter, HTTPException, Depends, Request, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.shop import Shop
from app.models.product import Product
from app.schemas.product import ProductPageResponse, ProductResponse

router = APIRouter()

@router.get("/", response_model=ProductPageResponse)
def get_products_by_subdomain_with_filtering_and_pagination(
    request: Request,
    category_id: int = Query(None, description="ID категории для фильтрации"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    per_page: int = Query(10, ge=1, le=100, description="Количество продуктов на странице"),
    db: Session = Depends(get_db),
):
    subdomain = request.headers.get("X-Subdomain")
    if not subdomain:
        raise HTTPException(status_code=400, detail="Subdomain header is required")
    
    shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    query = db.query(Product).filter(Product.shop_id == shop.id)

    if category_id:
        query = query.filter(Product.category_id == category_id)

    total_products = query.count()
    query = query.offset((page - 1) * per_page).limit(per_page)
    products = query.all()

    if not products:
        raise HTTPException(status_code=404, detail="Продукты не найдены")

    return ProductPageResponse(
        total=total_products,
        page=page,
        per_page=per_page,
        products=[
        ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            ingredients=product.ingredients,
            photo_url=f"{request.base_url}static/uploads/{product.photo_url}" if product.photo_url else ""
        )
        for product in products
    ],
    )

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(
    product_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    subdomain = request.headers.get("X-Subdomain")
    if not subdomain:
        raise HTTPException(status_code=400, detail="Subdomain header is required")

    shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    product = db.query(Product).filter(Product.id == product_id, Product.shop_id == shop.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")

    return ProductResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        ingredients=product.ingredients,
        photo_url=f"{request.base_url}static/uploads/{product.photo_url}" if product.photo_url else None,
    )