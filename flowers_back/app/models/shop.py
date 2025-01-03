from sqlalchemy import Column, String, Integer
from app.core.database import Base
from sqlalchemy.orm import relationship

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subdomain = Column(String, unique=True, nullable=False)
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)

    products = relationship(
        "Product", back_populates="shop", cascade="all, delete-orphan"
    )