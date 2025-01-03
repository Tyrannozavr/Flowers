from pydantic import BaseModel, HttpUrl, UUID4
from typing import Optional

class ShopCreate(BaseModel):
    subdomain: str
    logo_url: Optional[HttpUrl]
    primary_color: Optional[str]

class ShopUpdate(BaseModel):
    subdomain: Optional[str]
    logo_url: Optional[HttpUrl]
    primary_color: Optional[str]

class ShopResponse(BaseModel):
    id: int
    subdomain: str
    logo_url: Optional[HttpUrl]
    primary_color: Optional[str]

    class Config:
        orm_mode = True
