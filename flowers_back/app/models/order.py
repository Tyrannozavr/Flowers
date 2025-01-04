from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class OrderStatus(enum.Enum):
    NOT_PAID = "NOT_PAID"
    PAID = "PAID"
    CANCELED = "CANCELED"
    
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    recipient_name = Column(String)
    recipient_phone = Column(String)
    city = Column(String)
    street = Column(String)
    house = Column(String)
    building = Column(String)
    apartment = Column(String)
    delivery_method = Column(String)
    delivery_date = Column(String)
    delivery_time = Column(String)
    wishes = Column(String)
    card_text = Column(String)
    is_self_pickup = Column(Boolean, default=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.NOT_PAID)  
    is_sent = Column(Boolean, default=False)
    
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
