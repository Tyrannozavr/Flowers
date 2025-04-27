from enum import Enum
from typing import Optional, Dict, Annotated

from fastapi import Depends
from pydantic import BaseModel

from app.core.database import get_db
from app.models import User
from app.models import Shop
from sqlalchemy.orm import Session

from app.routes.admin import get_current_user


class DeliveryCostType(Enum):
    FIXED = "fixed"
    RADIUS = "radius"
    YANDEX_GO = "yandex_go"

class ShopDeliveryCostCreate(BaseModel):
    type: DeliveryCostType
    fixed_cost: Optional[int] = None
    radius_cost: Optional[Dict[int, int]] = {
        1: 0,
        5: 0,
        10: 0,
        20: 0
    }
    is_yandex_geo: bool = False

class ShopDeliveryCostResponse(BaseModel):
    type: str
    fixed_cost: Optional[int] = None
    radius_cost: Optional[Dict[int, int]] = None

def get_shop_by_owner(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Shop:
    shop = db.query(Shop).filter(Shop.owner_id == user.id).first()
    return shop


ShopByOwnerDep = Annotated[Shop, Depends(get_shop_by_owner)]