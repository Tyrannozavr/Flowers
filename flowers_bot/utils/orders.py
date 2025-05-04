import asyncio
import logging
from typing import List
from app.bot import bot
from utils.api import get_orders, get_consultations, get_admin_by_shop_id

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
                    shop_id = order.get("shop_id")
                    if shop_id:  
                        admin = await get_admin_by_shop_id(shop_id)
                        
                        if admin and admin.get("telegram_ids"):
                            for tg_id in admin["telegram_ids"]:
                                await send_order_message(tg_id, order)
                    else:
                        logging.error(f"Нет shop_id для заказа {order.get('id', 'unknown')}")
        except Exception as e:
            logging.error(f"Ошибка при обработке новых заказов: {e}")
        
        await asyncio.sleep(60)


async def send_order_message(tg_id: int, order: dict):
    """Отправляет заказ в Telegram, разбивая его на части, если сообщение длинное."""
    try:
        message = format_order_message(order)
        parts = split_message(message)
        for part in parts:
            await bot.send_message(chat_id=tg_id, text=part)
    except Exception as e:
        logging.error(f"Ошибка при отправке сообщения с заказом: {e}")

def format_order_message(order: dict) -> str:
    """Форматирует заказ для отправки в Telegram."""
    try:
        items = "\n".join(
            [f"- {item.get('name', 'Без имени')} (x{item.get('quantity', 1)}): {item.get('price', 0)} ₽" for item in order.get("items", [])]
        )
        return (
            f"📦 Новый заказ:\n"
            f"🆔 ID: {order.get('id', 'Не указан')}\n"
            f"👤 Имя: {order.get('fullName', 'Не указано')}\n"
            f"📞 Телефон: {order.get('phoneNumber', 'Не указан')}\n"
            f"👤 Получатель: {order.get('recipientName', 'Не указан')}\n"
            f"📞 Телефон получателя: {order.get('recipientPhone', 'Не указан')}\n"
            f"🏙️ Адрес: {order.get('city', 'Не указан')}, {order.get('street', 'Не указан')}, {order.get('house', 'Не указан')}, "
            f"{order.get('building', '')}, {order.get('apartment', '')}\n"
            f"🚚 Метод доставки: {order.get('deliveryMethod', 'Не указан')}\n"
            f"📅 Дата: {order.get('deliveryDate', 'Не указана')}\n"
            f"⏰ Время: {order.get('deliveryTime', 'Не указано')}\n"
            f"📝 Пожелания: {order.get('wishes', 'Не указаны')}\n"
            f"💌 Текст на открытке: {order.get('cardText', 'Не указан')}\n"
            f"📦 Товары:\n{items}\n"
            f"🟢 Статус: {order.get('status', 'Не указан')}\n"
        )
    except Exception as e:
        logging.error(f"Ошибка при форматировании сообщения заказа: {e}")
        return f"Ошибка при форматировании заказа ID: {order.get('id', 'Не указан')}"

async def send_new_consultations():
    """Фоновая задача для получения новых консультаций и отправки их пользователям."""
    while True:
        try:
            consultations = await get_consultations()
            if consultations:
                logging.info(f"Получено новых консультаций: {len(consultations)}")
                
                for consultation in consultations:
                    shop_id = consultation.get("shop_id")
                    if shop_id:  
                        admin = await get_admin_by_shop_id(shop_id)
                        
                        if admin and admin.get("telegram_ids"):
                            for tg_id in admin["telegram_ids"]:
                                await send_consultation_message(tg_id, consultation)
                    else:
                        logging.error(f"Нет shop_id для консультации {consultation.get('id', 'unknown')}")
        except Exception as e:
            logging.error(f"Ошибка при обработке новых консультаций: {e}")
        
        await asyncio.sleep(60)

async def send_consultation_message(tg_id: int, consultation: dict):
    """Отправляет консультацию в Telegram, разбивая её на части, если сообщение длинное."""
    try:
        message = format_consultation_message(consultation)
        parts = split_message(message)
        for part in parts:
            await bot.send_message(chat_id=tg_id, text=part)
    except Exception as e:
        logging.error(f"Ошибка при отправке сообщения с консультацией: {e}")

def format_consultation_message(consultation: dict) -> str:
    """Форматирует консультацию для отправки в Telegram."""
    try:
        return (
            f"📝 Новая консультация:\n"
            f"🆔 ID: {consultation.get('id', 'Не указан')}\n"
            f"👤 Имя: {consultation.get('full_name', 'Не указано')}\n"
            f"📞 Телефон: {consultation.get('phone_number', 'Не указан')}\n"
        )
    except Exception as e:
        logging.error(f"Ошибка при форматировании сообщения консультации: {e}")
        return f"Ошибка при форматировании консультации ID: {consultation.get('id', 'Не указан')}"
