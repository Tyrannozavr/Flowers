from enum import Enum
from typing import Optional, Dict

from pydantic import BaseModel

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

class ShopDeliveryCostResponse(BaseModel):
    type: str
    fixed_cost: Optional[int] = None
    radius_cost: Optional[Dict[int, int]] = None


