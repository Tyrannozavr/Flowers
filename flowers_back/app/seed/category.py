from sqlalchemy.orm import Session

from app.core.config import CATEGORY_IMAGE_RETRIEVAL_DIR
from app.models.category import Category
from app.repositories.shop import get_shop_list, get_shop_categories_list, add_shop_category
from app.repositories import categories as categories_repository


def seed_categories(db: Session):
    categories = [
        {"name": "Популярное", "value": "popular.jpeg"},
        {"name": "Витрина онлайн", "value": "online_showcase.jpeg"},
        {"name": "Авторские букеты", "value": "authored_bouquets.jpg"},
        {"name": "Монобукеты", "value": "mono_bouquets.jpeg"},
        {"name": "Композиции", "value": "compositions.jpeg"},
        {"name": "Сезонные", "value": "seasonal.jpeg"},
        {"name": "Сухоцветы", "value": "dried_flowers.jpg"},
        {"name": "Свадебный букет", "value": "wedding_bouquet.jpeg"},
        {"name": "Декор", "value": "decor.jfif"},
        {"name": "Аксессуары", "value": "accessories.jpg"},
    ]

    for category in categories:
        existing_category = db.query(Category).filter(Category.name == category["name"]).first()
        if not existing_category:
            new_category = Category(**category, image_url=f"{CATEGORY_IMAGE_RETRIEVAL_DIR}/{category.get('value')}")
            db.add(new_category)

    db.commit()
    created_categories = categories_repository.get_categories(db=db)
    shops = get_shop_categories_list(db=db)
    for shop in shops:
        if not shop.categories:
            for category in created_categories:
                add_shop_category(db=db, shop_id=shop.id, category_id=category.id)
    db.commit()
    print("Категории добавлены.")
