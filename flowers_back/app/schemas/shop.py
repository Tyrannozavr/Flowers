from pydantic import BaseModel, HttpUrl, UUID4
from typing import Optional

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

    class Config:
        orm_mode = True

class OwnerShopResponse(BaseModel):
    id: int
    subdomain: str

    class Config:
        orm_mode = True
