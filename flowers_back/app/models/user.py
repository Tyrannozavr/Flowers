from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)  # nullable True because there are already several users without email
    is_superadmin = Column(Boolean, default=False)
    telegram_ids = Column(JSONB, nullable=False, default=list)  
    is_removed = Column(Boolean, default=False) 

    shops = relationship("Shop", back_populates="owner")
