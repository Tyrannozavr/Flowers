from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse

router = APIRouter()

@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(request: Request, db: Session = Depends(get_db)):
    base_url = str(request.base_url)
    categories = db.query(Category).all()
    return [
        CategoryResponse(
            id=category.id,
            name=category.name,
            value=category.value,  # Добавляем поле value
            imageUrl=f"{base_url}static/categories/{category.value}"
        )
        for category in categories
    ]
