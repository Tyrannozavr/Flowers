import os
import uuid

from fastapi import APIRouter, Request, Depends, UploadFile, Form, HTTPException
from pydantic import HttpUrl
from sqlalchemy.orm import Session
from sqlalchemy import and_
from urllib.parse import urlparse

import app.repositories.categories
from app.core.config import CATEGORY_IMAGE_UPLOAD_DIR, CATEGORY_IMAGE_RETRIEVAL_DIR
from app.core.database import get_db
from app.dependencies.subdomain import ShopDep
from app.models import User
from app.models.category import Category
from app.repositories import categories as categories_repository
from app.routes.admin import get_current_user
from app.schemas.category import CategoryResponse
from app.models import Shop

router = APIRouter()


@router.get("/", response_model=list[CategoryResponse])
def get_categories_by_shop(
        request: Request,
        shop: ShopDep,
        db: Session = Depends(get_db),
):
    base_url = str(request.base_url)
    if shop is None:
        categories = categories_repository.get_categories(db=db)
    else:
        categories = app.repositories.categories.get_categories_by_shop_id(db=db, shop_id=shop.id)
        if categories is None:
            categories = app.repositories.categories.get_categories_by_shop_id(db=db, shop_id=shop.id)[:15]

    return [
        CategoryResponse(
            id=category.id,
            name=category.name,
            value=category.value,
            imageUrl=HttpUrl(f"{base_url}{category.image_url}")
        )
        for category in categories
    ]


@router.post("/", response_model=CategoryResponse)
def create_category(
        request: Request,
        name: str = Form(),
        image: UploadFile = None,
        db: Session = Depends(get_db)
):
    unique_filename = None
    if image:
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join(CATEGORY_IMAGE_UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            f.write(image.file.read())

    domain = request.base_url
    image_url = f"{os.path.join(CATEGORY_IMAGE_RETRIEVAL_DIR, unique_filename)}" if unique_filename else ""
    image_url_response = f"{domain}{os.path.join(CATEGORY_IMAGE_RETRIEVAL_DIR, unique_filename)}" if unique_filename else ""
    value = name.lower().replace(" ", "_")
    category = Category(name=name, image_url=image_url, value=value)
    db.add(category)
    db.commit()
    db.refresh(category)
    return CategoryResponse(
        id=category.id,
        name=category.name,
        value=category.value,
        imageUrl=HttpUrl(image_url_response)
    )


@router.post("/shop", response_model=CategoryResponse)
def create_category_for_shop(
        request: Request,
        name: str = Form(),
        image: UploadFile = None,
        user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # Extract subdomain from the origin header
    subdomain = None
    origin = request.headers.get('origin')
    if origin:
        parsed_url = urlparse(origin)
        host_parts = parsed_url.netloc.split('.')
        if len(host_parts) >= 2:
            subdomain = host_parts[0]
    if subdomain is None:
        raise HTTPException(status_code=400, detail="Subdomain header is required")

    unique_filename = None
    if image:
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        save_path = os.path.join(CATEGORY_IMAGE_UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            f.write(image.file.read())

    # Find the shop based on the user and subdomain
    shop = db.query(Shop).filter(and_(Shop.owner_id == user.id, Shop.subdomain == subdomain)).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found for this user and subdomain")

    image_url = f"{os.path.join(CATEGORY_IMAGE_RETRIEVAL_DIR, unique_filename)}" if unique_filename else ""
    image_url_response = CATEGORY_IMAGE_RETRIEVAL_DIR + unique_filename if unique_filename else ""
    value = name.lower().replace(" ", "_")
    category = Category(name=name, image_url=image_url, value=value)
    shop.categories.append(category)
    db.add(category)
    db.add(shop)
    db.commit()
    db.refresh(category)
    return CategoryResponse(
        id=category.id,
        name=category.name,
        value=category.value,
        imageUrl=HttpUrl(image_url_response)
    )


@router.delete("/{category_id}")
def delete_category(
        category_id: int,
        db: Session = Depends(get_db)
):
    app.repositories.categories.delete_category_by_id(db=db, category_id=category_id)
    return {"message": "Category deleted successfully"}
