import asyncio

import httpx
from typing import List
from app.config import BACKEND_API_URL, TELEGRAM_BOT_TOKEN
import logging
import aiohttp
from aiogram.types import File
from aiogram import Bot

async def get_orders() -> List[dict]:
    """Получить список заказов"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BACKEND_API_URL}/orders/")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logging.error("Ошибка подключения к бэкенду:", e)

async def get_orders_by_status(status: str) -> List[dict]:
    """Создать новый магазин через backend."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_API_URL}/orders/status?status={status}")
        response.raise_for_status()
        return response.json()

async def update_order_status(order_id: int, status: str) -> str:
    """Обновляет статус заказа."""
    url = f"{BACKEND_API_URL}/orders/{order_id}"
    params = {"status": status}
    print(f"Отправляем запрос: {url} с параметрами: {params}")
    
    async with httpx.AsyncClient() as client:
        response = await client.put(url, params=params)
        response.raise_for_status()
        return f"Статус заказа {order_id} успешно обновлен на {status}."

async def get_consultations():
    """Получает новые консультации с backend."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_API_URL}/consultations/")
        response.raise_for_status()
        return response.json()
    
async def get_admin_by_shop_id(shop_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_API_URL}/admins/shop/{shop_id}")
        response.raise_for_status()
        return response.json()

async def get_shops_by_user(user_id: str) -> list:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BACKEND_API_URL}/shops/user/{user_id}")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            error_detail = e.response.json().get("detail", "Неизвестная ошибка")
            raise Exception(f"Ошибка при получении магазинов: {error_detail}")
        except httpx.RequestError as e:
            raise Exception(f"Ошибка соединения с сервером: {e}")

async def get_categories(shop_id: int = None, shop_subdomain: str = None) -> list:
    async with httpx.AsyncClient() as client:
        url = f"{BACKEND_API_URL}/categories/"
        headers = {}
        if shop_subdomain:
            headers["X-Subdomain"] = shop_subdomain
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

async def create_product(data: dict, bot: Bot):
    file: File = await bot.get_file(data["image_id"])
    file_path = file.file_path
    file_url = f"https://api.telegram.org/file/bot{TELEGRAM_BOT_TOKEN}/{file_path}"

    async with aiohttp.ClientSession() as session:
        async with session.get(file_url) as file_response:
            if file_response.status != 200:
                raise Exception("Не удалось скачать файл из Telegram")

            file_data = await file_response.read()

            # Формируем multipart-данные
            form_data = aiohttp.FormData()
            form_data.add_field("shop_id", str(data["shop_id"]))
            form_data.add_field("name", data["name"])
            form_data.add_field("price", str(data["price"]))
            form_data.add_field("category_id", str(data["category_id"]))
            form_data.add_field("description", data["description"])
            form_data.add_field("ingredients", data["ingredients"])
            form_data.add_field("image", file_data, filename="image.jpg", content_type="image/jpeg")
            form_data.add_field("user_tg_id", str(data["user_tg_id"]))

            timeout = aiohttp.ClientTimeout(total=10)
            async with aiohttp.ClientSession(timeout=timeout) as client:
                try:
                    response = await client.post(f"{BACKEND_API_URL}/shops/telegram/{data['shop_id']}/products", data=form_data)
                    logging.info(f"Запрос отправлен, статус ответа: {response.status}")
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"Ошибка при создании букета: {response.status} - {error_text}")
                    return await response.json()
                except asyncio.TimeoutError:
                    logging.error("Тайм-аут запроса")
                    raise
                except aiohttp.ClientResponseError as e:
                    logging.error(f"HTTP ошибка: {e}")
                    raise
                except aiohttp.ClientConnectionError as e:
                    logging.error(f"Ошибка соединения: {e}")
                    raise
                except aiohttp.ClientPayloadError as e:
                    logging.error(f"Ошибка данных в запросе: {e}")
                    raise
                except Exception as e:
                    logging.error(f"Произошла непредвиденная ошибка: {e}")
                    raise