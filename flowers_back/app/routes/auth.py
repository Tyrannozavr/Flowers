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
from app.services.auth import register_user
from app.services.email import EmailNotification

load_dotenv()

router = APIRouter()
class Token(BaseModel):
    access_token: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.TOKEN_EXPIRY_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if "exp" not in payload or datetime.utcnow() > datetime.utcfromtimestamp(payload["exp"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

class LoginSchema(BaseModel):
    username: str
    password: str


@router.get("/check")
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    
    token = authorization.split(" ")[1] if " " in authorization else authorization
    token_data = decode_token(token)
    if token_data.get("username") != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return {"message": "Authenticated"}


@router.post("/login", response_model=Token)
async def login(form_data: LoginSchema, db: Session = Depends(get_db)):
    find_user = db.query(User).filter(User.username == form_data.username).first()

    if not find_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not verify_password(form_data.password, find_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token({"username": form_data.username, "id": find_user.id})
    return {"access_token": access_token}



@router.post("/register")
async def register(
        request: Request,
        form_data: UserRegistrationSchema,
        db: Session = Depends(get_db)
):
    print(request)
    if db.query(User).filter(User.email == form_data.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = await register_user(form_data, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while creating the user")
    else:
        email_notification = EmailNotification(
            smtp_server=settings.SMTP_SERVER,
            smtp_port=settings.SMTP_PORT,
            sender_email=settings.SENDER_EMAIL,
            sender_password=settings.SENDER_PASSWORD
        )
        await email_notification.send_email(
            email=form_data.email,
            login=user.username,
            password=form_data.password,
        )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"message": "User created successfully"}
    )