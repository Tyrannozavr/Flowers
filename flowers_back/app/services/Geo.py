from typing import Optional, Union

import requests
from fastapi.logger import logger
from geopy.distance import geodesic
from abc import ABC, abstractmethod
from typing import Optional

from app.models.order import AddressModel


class GeoService(ABC):
    @abstractmethod
    def get_coordinates(self, address_str: str) -> Optional[tuple]:
        pass

    @abstractmethod
    def calculate_distance(self, coords1: Union[tuple, str], coords2: Union[tuple, str]) -> float:
        pass


class YandexGeoService(GeoService):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.geocoder_url = "https://geocode-maps.yandex.ru/v1/"

    def get_coordinates(self, address_str: str) -> Optional[tuple]:
        # Формируем запрос к Яндекс.Геокодеру
        params = {
            "apikey": self.api_key,
            "geocode": address_str,
            "format": "json"
        }
        try:
            response = requests.get(self.geocoder_url, params=params)
            response.raise_for_status()  # Проверяем, что запрос успешен
            data = response.json()

            # Извлекаем координаты из ответа (API v1)
            features = data.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", [])
            if features:
                coordinates = features[0]["GeoObject"]["Point"]["pos"]
                longitude, latitude = map(float, coordinates.split())
                return latitude, longitude
            else:
                logger.error(f"Координаты не найдены. {params.get('geocode')}")
                return None
        except Exception as e:
            logger.error(f"Ошибка при геокодировании: {e}")
            return None

    def calculate_distance(self, coords1: Union[tuple, str], coords2: Union[tuple, str]) -> float:
        if isinstance(coords1, str):
            coords1 = self.get_coordinates(coords1)
        if isinstance(coords2, str):
            coords2 = self.get_coordinates(coords2)
        return geodesic(coords1, coords2).kilometers
    
    def validate_address(self, address_str: str) -> bool:
        params = {
            "apikey": self.api_key,
            "geocode": address_str,
            "format": "json"
        }
        try:
            response = requests.get(self.geocoder_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Получаем результаты геокодирования
            features = data.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", [])
            
            if not features:
                logger.error(f"Адрес не найден: {address_str}")
                return False
                
            # Берем первый результат (наиболее релевантный)
            geo_object = features[0]["GeoObject"]
            
            # Проверяем точность геокодирования
            precision = geo_object.get("metaDataProperty", {}).get("GeocoderMetaData", {}).get("precision")
            
            # Получаем текст найденного адреса для сравнения с введенным
            found_address = geo_object.get("metaDataProperty", {}).get("GeocoderMetaData", {}).get("text", "")
            
            # Нормализуем введенный и найденный адреса для сравнения
            # Удаляем запятые, лишние пробелы и приводим к нижнему регистру
            normalized_input = ' '.join(address_str.lower().replace(',', '').split())
            normalized_found = ' '.join(found_address.lower().replace(',', '').split())
            
            # Проверяем точность и соответствие
            # Для точного совпадения precision должен быть 'exact'
            # Для хорошего совпадения - 'near' или 'number'
            if precision in ['exact', 'number', 'near']:
                logger.info(f"Адрес найден с точностью {precision}: {found_address}")
                
                # Дополнительная проверка на совпадение ключевых частей адреса
                # Если введенный адрес полностью содержится в найденном
                if all(part in normalized_found for part in normalized_input.split()):
                    return True
                    
                # Логируем различия для отладки
                logger.warning(f"Введенный адрес: {address_str}")
                logger.warning(f"Найденный адрес: {found_address}")
                logger.warning(f"Введенный и найденный адреса не совпадают полностью")
            
            logger.error(f"Адрес найден, но точность низкая: {precision}")
            return False
            
        except Exception as e:
            logger.error(f"Ошибка при валидации адреса: {e}")
            return False

class DeliveryDistanceService:
    def __init__(self, address_data: AddressModel, geo_service: GeoService):
        self.address_data = address_data
        self.geo_service = geo_service

    def get_address_string(self) -> str:
        return self.address_data.to_address_string()

    def calculate_delivery_distance(self, shop_address: str) -> float:
        address_str = self.get_address_string()
        return self.geo_service.calculate_distance(address_str, shop_address)



    # return DeliveryDistanceService(address_data, YandexGeoService(api_key=Settings.YANDEX_GEOCODER_API_KEY))









