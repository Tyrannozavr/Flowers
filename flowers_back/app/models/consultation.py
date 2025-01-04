from sqlalchemy import Column, String, Integer, Boolean
from app.core.database import Base

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    is_sent = Column(Boolean, default=False)