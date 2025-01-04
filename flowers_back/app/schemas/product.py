from pydantic import BaseModel, Field
from typing import Optional, List

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    ingredients: Optional[str]
    photo_url: Optional[str] = "" 

    class Config:
        orm_mode = True
        
class ProductPageResponse(BaseModel):
    total: int
    page: int
    per_page: int
    products: List[ProductResponse]