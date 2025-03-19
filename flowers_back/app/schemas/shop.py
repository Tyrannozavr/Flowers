from pydantic import BaseModel, HttpUrl, UUID4
from typing import Optional
from typing import List, Optional

class Address(BaseModel):
    phone: str
    address: str

class ShopCreate(BaseModel):
    subdomain: str
    logo_url: Optional[HttpUrl]
    primary_color: Optional[str]
    inn: str
    phone: str

class ShopUpdate(BaseModel):
    subdomain: Optional[str]
    logo_url: Optional[HttpUrl]
    primary_color: Optional[str]
    inn: str
    phone: str

class ShopResponse(BaseModel):
    id: int
    subdomain: str
    logo_url: Optional[HttpUrl]
    primary_color: Optional[str]
    inn: Optional[str]
    phone: Optional[str]
    addresses: List[Address]

    class Config:
        from_attributes = True

class OwnerShopResponse(BaseModel):
    id: int
    subdomain: str

    class Config:
        from_attributes = True
