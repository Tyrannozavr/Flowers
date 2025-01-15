import httpx
from typing import List
from app.config import BACKEND_API_URL
import logging

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
    