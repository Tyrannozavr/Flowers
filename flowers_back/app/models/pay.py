from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class Pay(Base):
    __tablename__ = "pays"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String)
    last_pay_date = Column(DateTime, nullable=True)
    paid_until = Column(DateTime, nullable=True)
    payment_id = Column(String, nullable=True)
    email = Column(String, nullable=False)
    rebill_id = Column(String, nullable=True)
    pan = Column(String, nullable=True)
    card_id = Column(String, nullable=True)
    order_id = Column(String, nullable=True)
    timestamp = Column(DateTime, nullable=True)
