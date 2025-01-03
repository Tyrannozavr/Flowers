import httpx
from typing import List

API_BASE_URL = "http://127.0.0.1:8000"  # Укажите URL вашего backend

async def get_shops() -> List[dict]:
    """Получить список магазинов с backend."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/shops")
        response.raise_for_status()
        return response.json()

async def create_shop(subdomain: str) -> dict:
    """Создать новый магазин через backend."""
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{API_BASE_URL}/shops", json={"subdomain": subdomain})
        response.raise_for_status()
        return response.json()
