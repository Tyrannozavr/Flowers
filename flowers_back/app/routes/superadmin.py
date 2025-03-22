from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Form, Body
from fastapi.templating import Jinja2Templates
from fastapi_admin.responses import redirect
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.models import User
from app.core.database import get_db
from app.routes.auth import LoginSchema, create_access_token
from fastapi.responses import RedirectResponse
# from app.utils.auth import verify_password, create_access_token

router = APIRouter()

# Указываем папку с шаблонами
templates = Jinja2Templates(directory="templates")


# Endpoint для отображения формы входа
@router.get("/login")
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


# Endpoint для обработки данных формы
@router.post("/login")
async def login(
        username: str = Body(),
        password: str = Body(),
        db: Session = Depends(get_db),
):
    find_user = db.query(User).filter(User.username == username).first()

    if not find_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not verify_password(password, find_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"username": username, "id": find_user.id})

    return {"access_token": access_token}