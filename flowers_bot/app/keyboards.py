from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

def get_main_menu():
    buttons = [
        [KeyboardButton(text="Список заказов по статусу")],
        [KeyboardButton(text="Обновить статус заказа")],
    ]
    return ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)

def get_status_menu():
    buttons = [
        [KeyboardButton(text="NOT_PAID")],
        [KeyboardButton(text="PAID")],
        [KeyboardButton(text="CANCELED")],
        [KeyboardButton(text="Назад")],
    ]
    return ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)
