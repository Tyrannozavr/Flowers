from sqlalchemy import Column, String, Integer
from app.core.database import Base
import uuid

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    value = Column(String, unique=True, nullable=False)
    image_url = Column(String, nullable=True)
