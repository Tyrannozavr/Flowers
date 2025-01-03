from pydantic import BaseModel, HttpUrl

class CategoryResponse(BaseModel):
    id: int
    name: str
    value: str 
    image_url: HttpUrl  
    
    class Config:
        orm_mode = True
