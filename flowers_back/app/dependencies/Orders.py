



from typing import Annotated
from fastapi import Depends

from app.core.config import Settings
from app.models.order import AddressModel
from app.services.Geo import DeliveryDistanceService, YandexGeoService, GeoService


class AddressService:
    def __init__(self, address_data: AddressModel):
        self.address_data = address_data

    def get_address_string(self) -> str:
        return self.address_data.to_address_string()


def get_address_service(address_data: AddressModel) -> DeliveryDistanceService:
    return DeliveryDistanceService(address_data, YandexGeoService(api_key=Settings.YANDEX_GEOCODER_API_KEY))


DeliveryDistanceServiceDep = Annotated[str, Depends(get_address_service)]



