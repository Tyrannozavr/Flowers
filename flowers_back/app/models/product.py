from sqlalchemy import Table, Column, String, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from enum import Enum

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

# Association table for the many-to-many relationship between Product and ProductAttributeValue
product_attribute_value_association = Table(
    'product_attribute_value_association',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True),
    Column('attribute_value_id', Integer, ForeignKey('product_attribute_values.id'), primary_key=True)
)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    ingredients = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    photo_url = Column(String, nullable=True)  # Keep this for backward compatibility
    photos = Column(JSON, nullable=True)  # New field to store multiple photos
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    availability = Column(String, nullable=False, default=ProductAvailabilityVariants.AVAILABLE.value)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)

    category = relationship("Category")
    shop = relationship("Shop")

    # Many-to-many relationship with ProductAttributeValue
    attribute_values = relationship(
        "ProductAttributeValue",
        secondary=product_attribute_value_association,
        back_populates="products"
    )


class ProductAttribute(Base):
    """Характеристики товаров (например размер обуви)"""
    __tablename__ = "product_attributes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)  # Название характеристики (например, "Размер обуви")

    # Связь с вариантами характеристик
    attribute_values = relationship("ProductAttributeValue", back_populates="attribute")
    
    shop_types = relationship(
        "ShopType",
        secondary="shop_type_attributes",
        back_populates="attributes"
    )
    shop_type_attributes = relationship(
        "ShopTypeAttribute",
        back_populates="product_attribute",
        overlaps="shop_types"
    )

class ProductAttributeValue(Base):
    __tablename__ = "product_attribute_values"

    id = Column(Integer, primary_key=True, autoincrement=True)
    value = Column(String, nullable=False)  # Значение характеристики (например, "32")
    attribute_id = Column(Integer, ForeignKey("product_attributes.id"), nullable=False)  # Связь с характеристикой

    # Связь с характеристикой
    attribute = relationship("ProductAttribute", back_populates="attribute_values")

    # Many-to-many relationship with Product
    products = relationship(
        "Product",
        secondary=product_attribute_value_association,
        back_populates="attribute_values"
    )