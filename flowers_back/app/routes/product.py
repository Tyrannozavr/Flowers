from fastapi import APIRouter, HTTPException, Depends
from fastapi import Request, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product, ProductAttributeValue, ProductAttribute
from app.models.product import ProductAvailabilityVariants, AVAILABILITY_LABELS
from app.models.shop import Shop
from app.routes.auth import get_current_user
from app.schemas.product import ProductPageResponse, ProductWithAttributesResponse, ProductAttributeValueResponse
from app.schemas.product import ProductResponse, ProductImagesResponse


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

    base_url = str(request.base_url)
    return ProductPageResponse(
        total=total_products,
        page=page,
        per_page=per_page,
        products=[
            ProductImagesResponse(
                id=product.id,
                name=product.name,
                description=product.description,
                price=product.price,
                ingredients=product.ingredients,
                images=[f"{base_url}static/uploads/{photo}" for photo in product.photos]
                if product.photos else [f"{base_url}static/uploads/{product.photo_url}"],
                categoryId=product.category_id,
                availability=product.availability,
            )
            for product in products
        ],
    )


@router.get("/availability-options")
def get_availability_options(db: Session = Depends(get_db)):
    availability_options = [
        {"key": option.value, "value": AVAILABILITY_LABELS.get(option.value)}
        for option in ProductAvailabilityVariants
    ]
    return availability_options


@router.get("/{product_id}", response_model=ProductImagesResponse)
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

    base_url = str(request.base_url)
    return ProductImagesResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        ingredients=product.ingredients,
        images=[f"{base_url}static/uploads/{photo}" for photo in product.photos]
        if product.photos else [f"{base_url}static/uploads/{product.photo_url}"],
        categoryId=product.category_id,
        availability=product.availability,
    )


@router.post("/products/{product_id}/attributes/{attribute_value_id}", tags=["Products", "Attributes"])
def bind_product_with_attribute_value(
    product_id: int,
    attribute_value_id: int,
    db: Session = Depends(get_db)
):
    # Retrieve the product
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Retrieve the attribute value
    attribute_value = db.query(ProductAttributeValue).filter(ProductAttributeValue.id == attribute_value_id).first()
    if not attribute_value:
        raise HTTPException(status_code=404, detail="Attribute value not found")

    # Bind the product with the attribute value
    product.attribute_values.append(attribute_value)
    db.commit()

    return {"message": "Product successfully bound to attribute value"}

@router.get("/products/{product_id}/attributes",
            response_model=ProductWithAttributesResponse,
            tags=["Products", "Attributes"])
def get_product_with_attributes(
    product_id: int,
    db: Session = Depends(get_db)
):
    # Retrieve the product with its attributes
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Prepare the attributes response
    attributes = [
        ProductAttributeValueResponse(
            attribute_name=attribute_value.attribute.name,
            value=attribute_value.value
        )
        for attribute_value in product.attribute_values
    ]

    return ProductWithAttributesResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        ingredients=product.ingredients,
        photo_url=product.photo_url,
        attributes=attributes
    )


@router.post("/attributes", tags=["Attributes"])
def create_product_attribute(
    name: str,
    db: Session = Depends(get_db),
):
    attribute = ProductAttribute(name=name)
    db.add(attribute)
    db.commit()
    db.refresh(attribute)
    return {"message": "ProductAttribute created successfully", "attribute_id": attribute.id}

# Update ProductAttribute
@router.put("/attributes/{attribute_id}", tags=["Attributes"])
def update_product_attribute(
    attribute_id: int,
    name: str,
    shop_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    # Check if the user is the owner of the shop
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop or shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this shop")

    attribute = db.query(ProductAttribute).filter(ProductAttribute.id == attribute_id).first()
    if not attribute:
        raise HTTPException(status_code=404, detail="ProductAttribute not found")

    attribute.name = name
    db.commit()
    return {"message": "ProductAttribute updated successfully"}

# Delete ProductAttribute
@router.delete("/attributes/{attribute_id}", tags=["Attributes"])
def delete_product_attribute(
    attribute_id: int,
    shop_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    # Check if the user is the owner of the shop
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop or shop.owner_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this shop")

    attribute = db.query(ProductAttribute).filter(ProductAttribute.id == attribute_id).first()
    if not attribute:
        raise HTTPException(status_code=404, detail="ProductAttribute not found")

    db.delete(attribute)
    db.commit()
    return {"message": "ProductAttribute deleted successfully"}

# Create ProductAttributeValue
@router.post("/attribute-values", tags=["Attributes", "Values"])
def create_product_attribute_value(attribute_id: int, value: str, db: Session = Depends(get_db)):
    attribute = db.query(ProductAttribute).filter(ProductAttribute.id == attribute_id).first()
    if not attribute:
        raise HTTPException(status_code=404, detail="ProductAttribute not found")

    attribute_value = ProductAttributeValue(attribute_id=attribute_id, value=value)
    db.add(attribute_value)
    db.commit()
    db.refresh(attribute_value)
    return {"message": "ProductAttributeValue created successfully", "attribute_value_id": attribute_value.id}

# Update ProductAttributeValue
@router.put("/attribute-values/{attribute_value_id}", tags=["Attributes", "Values"])
def update_product_attribute_value(attribute_value_id: int, value: str, db: Session = Depends(get_db)):
    attribute_value = db.query(ProductAttributeValue).filter(ProductAttributeValue.id == attribute_value_id).first()
    if not attribute_value:
        raise HTTPException(status_code=404, detail="ProductAttributeValue not found")

    attribute_value.value = value
    db.commit()
    return {"message": "ProductAttributeValue updated successfully"}

# Delete ProductAttributeValue
@router.delete("/attribute-values/{attribute_value_id}", tags=["Attributes", "Values"])
def delete_product_attribute_value(attribute_value_id: int, db: Session = Depends(get_db)):
    attribute_value = db.query(ProductAttributeValue).filter(ProductAttributeValue.id == attribute_value_id).first()
    if not attribute_value:
        raise HTTPException(status_code=404, detail="ProductAttributeValue not found")

    db.delete(attribute_value)
    db.commit()
    return {"message": "ProductAttributeValue deleted successfully"}
