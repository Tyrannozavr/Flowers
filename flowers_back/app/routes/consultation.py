from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db 
from app.models.consultation import Consultation
from app.models.shop import Shop

router = APIRouter()

class ConsultationCreate(BaseModel):
    full_name: str = Field(..., max_length=255)
    phone_number: str = Field(..., max_length=15)

class ConsultationResponse(BaseModel):
    id: int
    full_name: str
    phone_number: str
    is_sent: bool
    shop_id: int
    
    class Config:
        from_attributes=True

@router.post("/", response_model=ConsultationResponse)
def create_consultation(request: Request, consultation_data: ConsultationCreate, db: Session = Depends(get_db)):
    """Создает новую консультацию."""
    subdomain = request.headers.get("X-Subdomain")
    if not subdomain:
        raise HTTPException(status_code=400, detail="Subdomain header is required")
    
    shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")
        
    consultation = Consultation(**consultation_data.dict(), shop_id=shop.id)
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation

@router.get("/", response_model=List[ConsultationResponse])
def get_unsent_consultations(db: Session = Depends(get_db)):
    """Получает все консультации с is_sent = False и обновляет их статус."""
    consultations = db.query(Consultation).filter(Consultation.is_sent == False).all()

    if not consultations:
        return []

    for consultation in consultations:
        consultation.is_sent = True
    db.commit()
    
    order_responses = [ConsultationResponse.from_orm(consultation) for consultation in consultations]
    return order_responses
