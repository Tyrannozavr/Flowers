from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from app.models.product import Product
from app.models.order import Order
from app.models.consultation import Consultation
from app.models.category import Category
from app.core.database import Base


class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subdomain = Column(String, unique=True, nullable=False)
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User")
    products = relationship(
        "Product", back_populates="shop", cascade="all, delete-orphan"
    )
    orders = relationship("Order", back_populates="shop")
    consultations = relationship("Consultation", back_populates="shop")
    categories = relationship("ShopCategories", back_populates="shop")

    addresses = Column(JSON,  nullable=True)




class ShopCategories(Base):
    __tablename__ = "shop_categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    shop = relationship("Shop")
    category = relationship("Category")
