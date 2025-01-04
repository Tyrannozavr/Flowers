import asyncio
import logging
from app.bot import bot
from utils.api import get_orders
from app.config import TG_USER_IDS
from typing import List

TELEGRAM_MESSAGE_LIMIT = 4096

def split_message(message: str, limit: int = TELEGRAM_MESSAGE_LIMIT) -> List[str]:
    """Разбивает сообщение на части, если оно превышает допустимый лимит."""
    if len(message) <= limit:
        return [message]

    parts = []
    while len(message) > limit:
        split_index = message.rfind("\n", 0, limit)
        if split_index == -1:
            split_index = limit
        parts.append(message[:split_index])
        message = message[split_index:].strip()

    if message:
        parts.append(message)

    return parts

async def send_new_orders():
    """Фоновая задача для получения новых заказов и отправки их пользователям."""
    while True:
        try:
            orders = await get_orders()
            print(orders)
            if orders:
                logging.info(f"Получено новых заказов: {len(orders)}")

                user_tg_ids = get_user_tg_ids()

                for order in orders:
                    for tg_id in user_tg_ids:
                        await send_order_message(tg_id, order)
        except Exception as e:
            logging.error(f"Ошибка при обработке новых заказов: {e}")

        await asyncio.sleep(60)
        
async def send_order_message(tg_id: int, order: dict):
    """Отправляет заказ в Telegram, разбивая его на части, если сообщение длинное."""
    message = format_order_message(order)
    parts = split_message(message)

    for part in parts:
        await bot.send_message(chat_id=tg_id, text=part)
        
def format_order_message(order: dict) -> str:
    """Форматирует заказ для отправки в Telegram."""
    items = "\n".join(
        [f"- {item['name']} (x{item['quantity']}): {item['price']} ₽" for item in order["items"]]
    )
    
    return (
        f"📦 Новый заказ:\n"
        f"🆔 ID: {order['id']}\n"
        f"👤 Имя: {order['full_name']}\n"
        f"📞 Телефон: {order['phone_number']}\n"
        f"👤 Получатель: {order['recipient_name']}\n"
        f"📞 Телефон получателя: {order['recipient_phone']}\n"
        f"🏙️ Адрес: {order['city']}, {order['street']}, {order['house']}, "
        f"{order.get('building', '')}, {order.get('apartment', '')}\n"
        f"🚚 Метод доставки: {order['delivery_method']}\n"
        f"📅 Дата: {order['delivery_date']}\n"
        f"⏰ Время: {order['delivery_time']}\n"
        f"📝 Пожелания: {order['wishes']}\n"
        f"💌 Текст на открытке: {order['card_text']}\n"
        f"📦 Товары:\n{items}\n"
        f"🟢 Статус: {order['status']}\n"
    )

def get_user_tg_ids() -> list:
    """Возвращает список Telegram ID пользователей для уведомления."""
    return TG_USER_IDS
