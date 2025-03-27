from sqlalchemy.orm import Session
from app.models.shop import Shop, ShopTypeAttribute, ShopAttribute

def apply_attributes_to_shop(db: Session, shop_id: int, shop_type_id: int):
    # Retrieve the shop instance
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise ValueError("Shop not found")

    # Retrieve ShopTypeAttributes for the given shop_type_id
    shop_type_attributes = (db.query(ShopTypeAttribute)
                            .filter_by(shop_type_id=shop_type_id)
                            .all()
                            )

    # Create ShopAttributes based on ShopTypeAttributes
    for shop_type_attribute in shop_type_attributes:
        shop_attribute = ShopAttribute(
            shop_id=shop.id,
            attribute_id=shop_type_attribute.attribute_id
        )
        db.add(shop_attribute)

    db.commit()
    return shop
