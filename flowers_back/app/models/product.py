from enum import Enum

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.shop import Shop


class ProductAvailabilityVariants(Enum):
    AVAILABLE = "AVAILABLE"
    TO_ORDER = "TO_ORDER"
    HIDDEN = "HIDDEN"

AVAILABILITY_LABELS = {
    ProductAvailabilityVariants.AVAILABLE.value: "Товар доступен",
    ProductAvailabilityVariants.TO_ORDER.value: "Товар под заказ",
    ProductAvailabilityVariants.HIDDEN.value: "Товар скрыт",
}

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    ingredients = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    photo_url = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    availability = Column(String, nullable=False, default=ProductAvailabilityVariants.AVAILABLE.value)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)

    category = relationship("Category")
    shop = relationship("Shop")


class ProductAttribute(Base):
    """Характеристики товаров (например размер обуви)"""
    __tablename__ = "product_attributes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)  # Название характеристики (например, "Размер обуви")

    # Связь с вариантами характеристик
    attribute_values = relationship("ProductAttributeValue", back_populates="attribute")
    shop_types = relationship("ShopType", secondary="shop_type_attributes", back_populates="attributes")


class ProductAttributeValue(Base):
    __tablename__ = "product_attribute_values"

    id = Column(Integer, primary_key=True, autoincrement=True)
    value = Column(String, nullable=False)  # Значение характеристики (например, "32")
    attribute_id = Column(Integer, ForeignKey("product_attributes.id"), nullable=False)  # Связь с характеристикой

    # Связь с характеристикой
    attribute = relationship("ProductAttribute", back_populates="attribute_values")