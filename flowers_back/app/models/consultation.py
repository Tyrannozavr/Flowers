from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from app.core.database import Base
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.shop import Shop


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    is_sent = Column(Boolean, default=False)
    
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False) 
    shop = relationship("Shop", back_populates="consultations")
    