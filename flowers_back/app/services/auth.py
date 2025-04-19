import random
import string
from fastapi import APIRouter, HTTPException, status, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from pydantic import BaseModel
from app.core.config import settings
from app.models.user import User
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, hash_password
from app.schemas.auth import UserRegistrationSchema

async def generate_unique_username(db: Session, base_username: str) -> str:
    username = base_username
    while db.query(User).filter(User.username == username).first():
        # If username exists, add 3 random alphanumeric characters
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
        username = f"{base_username}{random_suffix}"
    return username


async def register_user(form_data: UserRegistrationSchema, db: Session = Depends(get_db)):
    hashed_password = hash_password(form_data.password)
    base_username = form_data.email.split("@")[0]
    username = await generate_unique_username(db, base_username)

    user = User(
        username=username,
        email=form_data.email,
        password=hashed_password,
        is_superadmin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
