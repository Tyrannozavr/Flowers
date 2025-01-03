from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton

# Клавиатура для стартового меню
def get_main_menu():
    buttons = [
        [KeyboardButton(text="🛍 Список магазинов")],
        [KeyboardButton(text="➕ Добавить магазин")],
    ]
    return ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)
import logging

def get_shop_buttons(shops):
    if not shops:
        return InlineKeyboardMarkup(inline_keyboard=[])

    inline_keyboard = []
    for shop in shops:
        button = InlineKeyboardButton(
            text=f"{shop['subdomain']} ({'Logo' if shop['has_logo'] else 'No Logo'})",
            callback_data=f"shop:{shop['id']}"
        )
        inline_keyboard.append([button])  # Каждый магазин в отдельной строке

    return InlineKeyboardMarkup(inline_keyboard=inline_keyboard)