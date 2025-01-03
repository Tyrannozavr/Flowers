from pydantic import BaseModel
from typing import Optional, List

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    ingredients: Optional[str]
    photo_url: str

    class Config:
        orm_mode = True
        
class ProductPageResponse(BaseModel):
    total: int
    page: int
    per_page: int
    products: List[ProductResponse]