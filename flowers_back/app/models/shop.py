from enum import Enum

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.order import Order
    from app.models.consultation import Consultation
    from app.models.category import Category

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subdomain = Column(String, unique=True, nullable=False)
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    tg = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User")
    products = relationship(
        "Product", back_populates="shop", cascade="all, delete-orphan"
    )
    orders = relationship("Order", back_populates="shop")
    consultations = relationship("Consultation", back_populates="shop")
    categories = relationship("ShopCategories", back_populates="shop", cascade="all, delete-orphan")

    addresses = Column(JSON,  nullable=True, comment="contains {phone: int, address: str}")
    delivery_cost = relationship("ShopDeliveryCost", back_populates="shop", uselist=False)




class ShopCategories(Base):
    __tablename__ = "shop_categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    shop = relationship("Shop", back_populates="categories")
    category = relationship("Category", back_populates="shops")




class ShopDeliveryCost(Base):
    __tablename__ = "shop_delivery_cost"

    id = Column(Integer, primary_key=True, autoincrement=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False, unique=True)
    type = Column(String, nullable=False)
    fixed_cost = Column(Integer, nullable=True, comment="Если стоимость доставки фиксированная")
    radius_cost = Column(JSON,  nullable=True, comment="{радиус до: цена")

    shop = relationship("Shop", back_populates="delivery_cost", uselist=False)


class ShopType(Base):
    """Типа магазинов (например обувной)"""
    __tablename__ = "shop_types"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)  # Название типа магазина (например, "Обувной")
    icon = Column(String, nullable=True)  # Иконка (необязательное поле)

    # Связь с характеристиками
    attributes = relationship(
        "ProductAttribute",
        secondary="shop_type_attributes",
        back_populates="shop_types"
    )
    type_attributes = relationship(
        "ShopTypeAttribute",
        back_populates="shop_type",
        overlaps="attributes"
    )

class ShopTypeAttribute(Base):
    "Характеристики для типа магазина"
    __tablename__ = "shop_type_attributes"

    shop_type_id = Column(Integer, ForeignKey("shop_types.id"), primary_key=True)
    attribute_id = Column(Integer, ForeignKey("product_attributes.id"), primary_key=True)

    # Explicit relationships with back_populates
    shop_type = relationship(
        "ShopType",
        back_populates="type_attributes",
        overlaps="attributes"
    )
    product_attribute = relationship(
        "ProductAttribute",
        back_populates="shop_type_attributes",
        overlaps="shop_types"
    )


class ShopAttribute(Base):
    "Характеристики для конкретного магазина"
    __tablename__ = "shop_attributes"

    shop_id = Column(Integer, ForeignKey("shops.id"), primary_key=True)
    attribute_id = Column(Integer, ForeignKey("product_attributes.id"), primary_key=True)
