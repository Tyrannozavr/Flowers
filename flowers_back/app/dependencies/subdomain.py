from typing import Annotated, Union
from urllib.parse import urlparse

from fastapi import Request, Depends, HTTPException
from requests import Session

from app.core.database import get_db
from app.models.shop import Shop
from app.repositories import shop as shop_repository

def get_subdomain(request: Request) -> str:
    if request.headers.get("X-Subdomain"):
        return request.headers.get("X-Subdomain")
    else:
        subdomain = None
        origin = request.headers.get('origin')
        if origin:
            parsed_url = urlparse(origin)
            host_parts = parsed_url.netloc.split('.')
            if len(host_parts) >= 2:
                subdomain = host_parts[0]
            return subdomain
        if subdomain is None:
            raise HTTPException(status_code=400, detail="Subdomain header is required")

SubdomainDep = Annotated[str, Depends(get_subdomain)]

def get_shop(subdomain: SubdomainDep, db: Session = Depends(get_db)) -> Union[Shop, None]:
    shop = shop_repository.get_shop_by_subdomain(subdomain=subdomain, db_session=db)
    return shop

ShopDep = Annotated[Shop, Depends(get_shop)]