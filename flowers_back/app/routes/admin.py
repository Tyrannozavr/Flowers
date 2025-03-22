from fastapi import APIRouter, HTTPException, status, Depends, Header
from dotenv import load_dotenv
from app.models.user import User
from app.models.shop import Shop
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.routes.auth import decode_token
from pydantic import BaseModel

load_dotenv()

router = APIRouter()

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    if "Bearer" in authorization:
        token = authorization.split(" ")[1]
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format"
        )

    try:
        token_data = decode_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Ищем пользователя в базе данных
    user = db.query(User).filter(User.username == token_data.get("username")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if user.is_removed:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is deactivated"
        )

    return user


def get_user_by_token(token: str = Header(None), db: Session = Depends(get_db)):
    try:
        token_data = decode_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Ищем пользователя в базе данных
    user = db.query(User).filter(User.username == token_data.get("username")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if user.is_removed:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is deactivated"
        )

    return user


def check_superadmin(current_user: User = Depends(get_current_user)):
    if not current_user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )

@router.get("/me")
async def get_me(user: User = Depends(get_current_user),
    _: Session = Depends(get_db)):
    return user

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_admin(
    username: str,
    password: str,
    _: User = Depends(check_superadmin),
    db: Session = Depends(get_db)
):
    hashed_password = hash_password(password)

    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    new_user = User(
        username=username,
        password=hashed_password,
        is_superadmin=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": f"Администратор {username} успешно создан!"}

@router.get("/", status_code=status.HTTP_200_OK)
async def get_admins_list(
    _: User = Depends(check_superadmin),
    db: Session = Depends(get_db)
):
    admins = db.query(User).filter(User.is_superadmin == False).all()

    if not admins:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No admins found"
        )

    return admins

class AdminTelegramRequest(BaseModel):
    telegram_id: str

@router.post("/telegram/add", status_code=status.HTTP_200_OK)
async def add_telegram_id(
    request: AdminTelegramRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    telegram_id = request.telegram_id
    
    admin = db.query(User).filter(User.id == user.id).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )

    if admin.telegram_ids is None:
        admin.telegram_ids = []

    if telegram_id in admin.telegram_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Telegram ID already added"
        )

    updated_telegram_ids = admin.telegram_ids + [telegram_id]
    db.query(User).filter(User.id == user.id).update(
        {"telegram_ids": updated_telegram_ids},
        synchronize_session=False
    )

    db.commit()
    return {"message": f"Telegram ID {telegram_id} успешно добавлен администратору {admin.username}"}

@router.delete("/telegram/remove", status_code=status.HTTP_200_OK)
async def remove_telegram_id(
    request: AdminTelegramRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    telegram_id = request.telegram_id
    admin = db.query(User).filter(User.id == user.id).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )

    if admin.telegram_ids is None or telegram_id not in admin.telegram_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Telegram ID not found"
        )

    updated_telegram_ids = [tid for tid in admin.telegram_ids if tid != telegram_id]

    db.query(User).filter(User.id == user.id).update(
        {"telegram_ids": updated_telegram_ids},
        synchronize_session=False
    )

    db.commit()
    return {"message": f"Telegram ID {telegram_id} успешно удалён у администратора {admin.username}"}

@router.put("/{admin_id}/deactivate", status_code=status.HTTP_200_OK)
async def deactivate_admin(
    admin_id: int,
    current_admin: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if (current_admin.id == admin_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot deactivate yourself"
        )
        
    user = db.query(User).filter(User.id == admin_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.is_removed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already deactivated"
        )

    user.is_removed = True
    db.commit()
    db.refresh(user)

    return {"message": f"User {user.username} has been deactivated."}

@router.put("/{admin_id}/activate", status_code=status.HTTP_200_OK)
async def activate_admin(
    admin_id: int,
    _: User = Depends(check_superadmin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == admin_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.is_removed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already active"
        )

    user.is_removed = False
    db.commit()
    db.refresh(user)

    return {"message": f"User {user.username} has been activated."}

@router.get("/shop/{shop_id}", status_code=status.HTTP_200_OK)
async def get_admin_by_shop_id(
    shop_id: int,
    db: Session = Depends(get_db)
):
    try:
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if not shop:
            raise HTTPException(status_code=404, detail="Shop not found")
        
        owner = shop.owner
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        
        return {
            "id": owner.id,
            "telegram_ids": owner.telegram_ids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving admin: {str(e)}")