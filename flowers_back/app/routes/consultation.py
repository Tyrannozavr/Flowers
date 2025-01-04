from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db 
from app.models.consultation import Consultation

router = APIRouter()

class ConsultationCreate(BaseModel):
    full_name: str = Field(..., max_length=255)
    phone_number: str = Field(..., max_length=15)

class ConsultationResponse(BaseModel):
    id: int
    full_name: str
    phone_number: str
    is_sent: bool
 
    class Config:
        from_attributes=True

@router.post("/", response_model=ConsultationResponse)
def create_consultation(consultation_data: ConsultationCreate, db: Session = Depends(get_db)):
    """Создает новую консультацию."""
    consultation = Consultation(**consultation_data.dict())
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
