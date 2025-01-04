from pydantic import BaseModel, HttpUrl

class CategoryResponse(BaseModel):
    id: int
    name: str
    value: str 
    imageUrl: HttpUrl  
    
    class Config:
        orm_mode = True
