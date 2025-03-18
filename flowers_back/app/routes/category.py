import os
import uuid

from fastapi import APIRouter, Request, Depends, UploadFile, Form
from pydantic import HttpUrl
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse

router = APIRouter()
IMAGE_UPLOAD_DIR = "categories"
IMAGE_RETRIEVAL_DIR = "static/categories"


@router.get("/", response_model=list[CategoryResponse])
def get_categories(request: Request, db: Session = Depends(get_db)):
    base_url = str(request.base_url)
    categories = get_categories(db=db)
    return [
        CategoryResponse(
            id=category.id,
            name=category.name,
            value=category.value,
            imageUrl=f"{base_url}static/categories/{category.value}"
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
        save_path = os.path.join(IMAGE_UPLOAD_DIR, unique_filename)

        with open(save_path, "wb") as f:
            print("saving image ", image.file)
            f.write(image.file.read())

    domain = request.base_url
    image_url = f"{domain}{os.path.join(IMAGE_RETRIEVAL_DIR, unique_filename)}" if unique_filename else ""
    category = Category(name=name, image_url=image_url, value=value)
    db.add(category)
    db.commit()
    db.refresh(category)
    return CategoryResponse(
        id=category.id,
        name=category.name,
        value=category.value,
        imageUrl=HttpUrl(image_url)
    )
