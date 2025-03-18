from typing import Type

from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.shop import Shop, ShopCategories


def get_categories(db: Session) -> list[Type[Category]]:
    return db.query(Category).all()

def get_categories_by_shop_id(db: Session, shop_id: int) -> list[Type[Category]]:
    return db.query(Category).join(Category.shops).filter(Category.shops.any(shop_id=shop_id)).all()

def get_shop_list(db: Session) -> list[Type[Shop]]:
    return db.query(Shop).all()

def get_shop_categories_list(db: Session) -> list[Type[Shop]]:
    return (
        db.query(Shop)
        .outerjoin(ShopCategories)
        .all()
    )

def add_shop_category(db: Session, shop_id: int, category_id: int):
    shop_category = ShopCategories(shop_id=shop_id, category_id=category_id)
    db.add(shop_category)
    db.commit()
    db.refresh(shop_category)
    return shop_category

def remove_shop_category(db: Session, shop_id: int, category_id: int):
    shop_category = (
        db.query(ShopCategories)
        .filter(ShopCategories.shop_id == shop_id, ShopCategories.category_id == category_id)
        .first()
    )
    if shop_category:
        db.delete(shop_category)
        db.commit()
        return True
    return False