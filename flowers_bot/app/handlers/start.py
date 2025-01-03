from aiogram import Router
from aiogram.types import Message
from aiogram.filters import Command
from app.keyboards import get_main_menu

router = Router()

@router.message(Command("start"))
async def start_command(message: Message):
    await message.answer(
        "Привет! Я бот для управления магазинами!\nВыберите действие:",
        reply_markup=get_main_menu()
    )

