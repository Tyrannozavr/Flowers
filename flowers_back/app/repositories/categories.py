from typing import Type

from sqlalchemy.orm import Session

from app.models.category import Category


def get_categories(db: Session) -> list[Type[Category]]:
    return db.query(Category).all()


def get_categories_by_shop_id(db: Session, shop_id: int) -> list[Type[Category]]:
    return db.query(Category).join(Category.shops).filter(Category.shops.any(shop_id=shop_id)).all()

def delete_category_by_id(db: Session, category_id: int):
    db.query(Category).filter(Category.id == category_id).delete()
    db.commit()
