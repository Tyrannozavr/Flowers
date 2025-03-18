from typing import Annotated, Union

from fastapi import Request, Depends, HTTPException
from requests import Session

from app.core.database import get_db
from app.models.shop import Shop
from app.repositories import shop as shop_repository

def get_subdomain(request: Request) -> str:
    return request.headers.get("X-Subdomain")

SubdomainDep = Annotated[str, Depends(get_subdomain)]

def get_shop(subdomain: SubdomainDep, db: Session = Depends(get_db)) -> Union[Shop, None]:
    shop = shop_repository.get_shop_by_subdomain(subdomain=subdomain, db_session=db)
    return shop

ShopDep = Annotated[Shop, Depends(get_shop)]