from fastapi import APIRouter, HTTPException, status, Header
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from pydantic import BaseModel
from app.core.config import settings

load_dotenv()

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str


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


@router.get("/auth/check")
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    
    token = authorization.split(" ")[1] if " " in authorization else authorization
    token_data = decode_token(token)
    if token_data.get("username") != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return {"message": "Authenticated"}


class LoginSchema(BaseModel):
    username: str
    password: str


@router.post("/auth/login", response_model=Token)
async def login(form_data: LoginSchema):
    if form_data.username != settings.ADMIN_USERNAME or form_data.password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token({"username": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}
