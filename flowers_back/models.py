from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    Enum,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship
from database import Base
import enum


class OperationType(enum.Enum):
    consultation = "consultation"
    purchase = "purchase"


class OrderStatus(enum.Enum):
    paid = "paid"
    unpaid = "unpaid"


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subdomain = Column(String, unique=True, nullable=False)
    accent_color = Column(String, nullable=False)
    logo_url = Column(String, nullable=False)

    products = relationship("Product", back_populates="store")
    orders = relationship("Order", back_populates="store")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    image_url = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    image_url = Column(String, nullable=False)

    store = relationship("Store", back_populates="products")
    category = relationship("Category", back_populates="products")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    operation_type = Column(Enum(OperationType), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.unpaid)
    store_id = Column(Integer, ForeignKey("stores.id"))

    store = relationship("Store", back_populates="orders")
