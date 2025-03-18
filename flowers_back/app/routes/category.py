import os
import uuid

from fastapi import APIRouter, Request, Depends, UploadFile, Form
from pydantic import HttpUrl
from sqlalchemy.orm import Session

import app.repositories.categories
from app.core.config import CATEGORY_IMAGE_UPLOAD_DIR, CATEGORY_IMAGE_RETRIEVAL_DIR
from app.core.database import get_db
from app.dependencies.subdomain import ShopDep
from app.models.category import Category
from app.models.shop import Shop
from app.schemas.category import CategoryResponse
from app.repositories import categories as categories_repository

router = APIRouter()


@router.get("/", response_model=list[CategoryResponse])
def get_categories(
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
        value: str = Form(...),
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
