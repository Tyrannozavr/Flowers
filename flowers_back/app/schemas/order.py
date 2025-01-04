from typing import List
from pydantic import BaseModel, Field
from enum import Enum

class OrderStatus(str, Enum):
    NOT_PAID = "NOT_PAID"
    PAID = "PAID"
    CANCELED = "CANCELED"

class Item(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

    class Config:
        orm_mode = True
        from_attributes = True
    
class Order(BaseModel):
    apartment: str
    building: str
    cardText: str
    city: str
    deliveryDate: str
    deliveryMethod: str
    deliveryTime: str
    fullName: str
    house: str
    isSelfPickup: bool
    items: List[Item]
    phoneNumber: str
    recipientName: str
    recipientPhone: str
    street: str
    wishes: str

    class Config:
        orm_mode = True
        from_attributes = True
    
class OrderResponse(BaseModel):
    id: int
    fullName: str = Field(alias="full_name")
    phoneNumber: str = Field(alias="phone_number")
    recipientName: str = Field(alias="recipient_name")
    recipientPhone: str = Field(alias="recipient_phone")
    city: str
    street: str
    house: str
    building: str
    apartment: str
    deliveryMethod: str = Field(alias="delivery_method")
    deliveryDate: str = Field(alias="delivery_date")
    deliveryTime: str = Field(alias="delivery_time")
    wishes: str
    cardText: str = Field(alias="card_text")
    isSelfPickup: bool = Field(alias="is_self_pickup")
    status: str
    isSent: bool = Field(alias="is_sent")
    items: List[Item]

    class Config:
        orm_mode = True
        from_attributes = True
