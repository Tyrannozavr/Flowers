from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    is_self_pickup = Column(Boolean, nullable=False)
    recipient_name = Column(String, nullable=True)
    recipient_phone = Column(String, nullable=True)
    city = Column(String, nullable=True)
    street = Column(String, nullable=True)
    house = Column(String, nullable=True)
    building = Column(String, nullable=True)
    apartment = Column(String, nullable=True)
    delivery_method = Column(String, nullable=False)
    delivery_time = Column(String, nullable=True)
    delivery_date = Column(String, nullable=True)
    wishes = Column(String, nullable=True)
    card_text = Column(String, nullable=True)
    is_paid = Column(Boolean, default=False)

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
