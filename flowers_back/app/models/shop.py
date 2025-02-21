from sqlalchemy import Column, String, Integer, ForeignKey
from app.core.database import Base
from sqlalchemy.orm import relationship

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subdomain = Column(String, unique=True, nullable=False)
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User")
    products = relationship(
        "Product", back_populates="shop", cascade="all, delete-orphan"
    )
    orders = relationship("Order", back_populates="shop")  
    consultations = relationship("Consultation", back_populates="shop")  
    