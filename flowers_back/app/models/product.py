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
