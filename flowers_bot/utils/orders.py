import asyncio
import logging
from typing import List
from app.bot import bot
from utils.api import get_orders, get_consultations, get_admin_by_shop_id
from app.config import TG_USER_IDS

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
            if orders:
                logging.info(f"Получено новых заказов: {len(orders)}")
                
                for order in orders:
                    shop_id = order["shop_id"]
                    if shop_id:  
                        admin = await get_admin_by_shop_id(shop_id)
                        
                        if admin and admin.get("telegram_ids"):
                            for tg_id in admin["telegram_ids"]:
                                await send_order_message(tg_id, order)
                    else:
                        logging.error(f"Нет shop_id для заказа {order.id}")
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

async def send_new_consultations():
    """Фоновая задача для получения новых консультаций и отправки их пользователям."""
    while True:
        try:
            consultations = await get_consultations()
            if consultations:
                logging.info(f"Получено новых консультаций: {len(consultations)}")
                
                for consultation in consultations:
                    shop_id = consultation["shop_id"]
                    if shop_id:  
                        admin = await get_admin_by_shop_id(shop_id)
                        
                        if admin and admin.get("telegram_ids"):
                            for tg_id in admin["telegram_ids"]:
                                await send_consultation_message(tg_id, consultation)
                    else:
                        logging.error(f"Нет shop_id для консультации {consultation.id}")
        except Exception as e:
            logging.error(f"Ошибка при обработке новых консультаций: {e}")
        
        await asyncio.sleep(60)

async def send_consultation_message(tg_id: int, consultation: dict):
    """Отправляет консультацию в Telegram, разбивая её на части, если сообщение длинное."""
    message = format_consultation_message(consultation)
    parts = split_message(message)
    for part in parts:
        await bot.send_message(chat_id=tg_id, text=part)

def format_consultation_message(consultation: dict) -> str:
    """Форматирует консультацию для отправки в Telegram."""
    return (
        f"📝 Новая консультация:\n"
        f"🆔 ID: {consultation['id']}\n"
        f"👤 Имя: {consultation['full_name']}\n"
        f"📞 Телефон: {consultation['phone_number']}\n"
    )
