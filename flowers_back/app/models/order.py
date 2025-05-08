import enum
from typing import TYPE_CHECKING, Union

from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.core.database import Base

if TYPE_CHECKING:
    pass


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

    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    shop = relationship("Shop", back_populates="orders")

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


class AddressModel(BaseModel):
    city: str = Field(..., description="Город")
    street: str = Field(..., description="Улица")
    house: str = Field(..., description="Дом")
    building: Union[str, None] = Field(None, description="Корпус")
    apartment: Union[str, None ]= Field(None, description="Квартира")

    def to_address_string(self, without_building: bool = False, without_apartment: bool = False) -> str:
        # Формируем строку адреса
        address_parts = [self.city, self.street, self.house]
        if self.building and not without_building:
            address_parts.append(f"корпус {self.building}")
        if self.apartment and not without_apartment:
            address_parts.append(f"квартира {self.apartment}")
        return ", ".join(address_parts)
