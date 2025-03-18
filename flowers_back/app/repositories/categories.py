from typing import Type

from sqlalchemy.orm import Session

from app.models.category import Category


def get_categories(db: Session) -> list[Type[Category]]:
    return db.query(Category).all()
