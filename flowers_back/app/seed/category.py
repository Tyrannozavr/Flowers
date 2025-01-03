from sqlalchemy.orm import Session
from app.models.category import Category

def seed_categories(db: Session):
    categories = [
        {"name": "Популярное", "value": "popular.jpeg"},
        {"name": "Витрина онлайн", "value": "online_showcase.jpeg"},
        {"name": "Новый год", "value": "new_year.jpg"},
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
            new_category = Category(**category)
            db.add(new_category)

    db.commit()
    print("Категории добавлены.")
