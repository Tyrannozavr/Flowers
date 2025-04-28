from typing import Type

from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.shop import Shop, ShopCategories, ShopDeliveryCost
from app.services import Shop as ShopService


def get_shop_list(db: Session) -> list[Type[Shop]]:
    return db.query(Shop).all()

def get_shop_by_id(db: Session, shop_id: int) -> Type[Shop]:
    return db.query(Shop).filter(Shop.id == shop_id).first()

def get_shop_by_subdomain(db_session, subdomain: str):
    return db_session.query(Shop).filter(Shop.subdomain == subdomain).first()

def get_shop_categories_list(db: Session) -> list[Type[Shop]]:
    return (
        db.query(Shop)
        .outerjoin(ShopCategories)
        .all()
    )

def add_shop_categories(db: Session, shop_id: int, categories: list[int]):
    for category_id in categories:
        # Check if category exists
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            continue

        existing = (
            db.query(ShopCategories)
            .filter(ShopCategories.shop_id == shop_id, ShopCategories.category_id == category_id)
            .first()
        )

        if not existing:
            shop_category = ShopCategories(shop_id=shop_id, category_id=category_id)
            db.add(shop_category)
    db.commit()

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

def delete_shop_category(db: Session, category_id: int, shop_id: int):
    (db.query(ShopCategories)
     .filter(ShopCategories.category_id == category_id and ShopCategories.shop_id == shop_id)
     .delete()
     )
    db.commit()

def get_shop_delivery_cost(db: Session, shop_id: int):
    return db.query(Shop).filter(Shop.id == shop_id).first().delivery_cost

def update_shop_delivery_cost(db: Session, shop_id: int, delivery_cost):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    
    # Get the existing delivery cost or create a new one if it doesn't exist
    if not shop.delivery_cost:
        shop.delivery_cost = ShopDeliveryCost()
    
    # Update the delivery cost attributes from the Pydantic model
    shop.delivery_cost.type = delivery_cost.type.value  # Use .value for enum
    shop.delivery_cost.fixed_cost = delivery_cost.fixed_cost
    shop.delivery_cost.radius_cost = delivery_cost.radius_cost
    shop.delivery_cost.is_yandex_geo = delivery_cost.is_yandex_geo
    
    db.commit()
    db.refresh(shop)
    return shop.delivery_cost

def create_shop_delivery_cost(db: Session, shop_id: int, delivery_cost: Shop.delivery_cost):
    delivery_cost = ShopService.create_shop_delivery_cost(delivery_cost)
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    shop.delivery_cost = delivery_cost
    db.commit()
    db.refresh(shop)
    return shop.delivery_cost