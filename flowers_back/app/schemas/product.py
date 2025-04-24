from pydantic import BaseModel, Field
from typing import Optional, List

from app.models.product import ProductAvailabilityVariants
from pydantic import BaseModel
from typing import List, Optional


class ProductAttributeValueResponse(BaseModel):
    attribute_name: str
    value: str


class ProductWithAttributesResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    ingredients: Optional[str]
    photo_url: Optional[str]
    attributes: List[ProductAttributeValueResponse]


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    ingredients: Optional[str]
    photo_url: Optional[str] = ""
    categoryId: Optional[int] = None,
    availability: ProductAvailabilityVariants = ProductAvailabilityVariants.AVAILABLE

    class Config:
        from_attributes = True


class ProductImagesResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    ingredients: Optional[str]
    images: List[str] = []
    categoryId: Optional[int] = None,
    availability: ProductAvailabilityVariants = ProductAvailabilityVariants.AVAILABLE

    class Config:
        from_attributes = True


class ProductPageResponse(BaseModel):
    total: int
    page: int
    per_page: int
    products: List[ProductImagesResponse]