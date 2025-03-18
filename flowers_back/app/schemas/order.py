from typing import List, Optional
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
        from_attributes = True

class OwnerResponse(BaseModel):
    id: int
    username: str
    telegram_ids: List[str]

    class Config:
        from_attributes = True

class ShopResponse(BaseModel):
    id: int
    subdomain: str
    owner: OwnerResponse

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    fullName: Optional[str] = Field(alias="full_name")
    phoneNumber: Optional[str] = Field(alias="phone_number")
    recipientName: Optional[str] = Field(alias="recipient_name")
    recipientPhone: Optional[str] = Field(alias="recipient_phone")
    city: Optional[str] = None
    street: Optional[str] = None
    house: Optional[str] = None
    building: Optional[str] = None
    apartment: Optional[str] = None
    deliveryMethod: Optional[str] = Field(alias="delivery_method")
    deliveryDate: Optional[str] = Field(alias="delivery_date")
    deliveryTime: Optional[str] = Field(alias="delivery_time")
    wishes: Optional[str] = None
    cardText: Optional[str] = Field(alias="card_text")
    isSelfPickup: Optional[bool] = Field(alias="is_self_pickup")
    status: Optional[str] = None
    isSent: Optional[bool] = Field(alias="is_sent")
    items: List[Item] = []
    shop_id: Optional[int] = None

    class Config:
        from_attributes = True
