from app.core.database import SessionLocal
from app.models.user      import User
from app.core.security import hash_password
from app.core.config import settings

def create_superadmin():
    db = SessionLocal()
    
    superadmin = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
    if superadmin:
        return

    hashed_password = hash_password(settings.ADMIN_PASSWORD)
    new_superadmin = User(
        username=settings.ADMIN_USERNAME,
        password=hashed_password,
        is_superadmin=True,
        telegram_ids=[]
    )

    db.add(new_superadmin)
    db.commit()
    db.refresh(new_superadmin)

