from aiogram import Router, types
from aiogram.types import ReplyKeyboardRemove
from utils.api import get_orders_by_status, update_order_status
from utils.orders import format_order_message
from app.keyboards import get_main_menu, get_status_menu

router = Router()

# Словарь для отслеживания контекста пользователя (какое действие выполняется)
user_context = {}
order_id_to_update = {}

@router.message(lambda message: message.text == "Список заказов по статусу")
async def ask_status(message: types.Message):
    """Запрашивает статус для фильтрации заказов."""
    user_context[message.from_user.id] = "filter_orders"
    await message.answer(
        "Выберите статус заказов для фильтрации:",
        reply_markup=get_status_menu()
    )

@router.message(lambda message: message.text == "Обновить статус заказа")
async def ask_order_id(message: types.Message):
    """Спрашивает ID заказа для обновления."""
    user_context[message.from_user.id] = "update_status"
    await message.answer(
        "Введите ID заказа, статус которого хотите обновить:",
        reply_markup=ReplyKeyboardRemove()
    )

@router.message(lambda message: message.text.isdigit())
async def ask_new_status(message: types.Message):
    """Запрашивает новый статус для указанного ID заказа."""
    global order_id_to_update
    order_id_to_update[message.from_user.id] = int(message.text)
    await message.answer(
        "Выберите новый статус:",
        reply_markup=get_status_menu()
    )

@router.message(lambda message: message.text in ["NOT_PAID", "PAID", "CANCELED"])
async def handle_status_selection(message: types.Message):
    """Обрабатывает выбор статуса в зависимости от контекста пользователя."""
    status = message.text
    user_id = message.from_user.id
    context = user_context.get(user_id)

    print(f"Контекст для пользователя {user_id}: {context}")
    
    if context == "filter_orders":
        await send_orders_by_status(message, status)
    elif context == "update_status":
        await update_status(message, status)
    else:
        await message.answer("Непредвиденная ошибка. Попробуйте снова.", reply_markup=get_main_menu())

async def send_orders_by_status(message: types.Message, status: str):
    """Отправляет список заказов по выбранному статусу."""
    try:
        orders = await get_orders_by_status(status)
        if not orders:
            await message.answer(f"Нет заказов со статусом {status}.", reply_markup=get_main_menu())
        else:
            for order in orders:
                await message.answer(format_order_message(order))
    except Exception as e:
        await message.answer(f"Ошибка при получении заказов: {e}", reply_markup=get_main_menu())

async def update_status(message: types.Message, new_status: str):
    """Обновляет статус указанного заказа."""
    global order_id_to_update
    order_id = order_id_to_update.get(message.from_user.id)
    if not order_id:
        await message.answer("Не удалось найти ID заказа. Попробуйте снова.", reply_markup=get_main_menu())
        return

    try:
        result = await update_order_status(order_id, new_status)
        await message.answer(result, reply_markup=get_main_menu())
    except Exception as e:
        await message.answer(f"Ошибка при обновлении статуса: {e}", reply_markup=get_main_menu())

@router.message(lambda message: message.text == "Назад")
async def go_back_to_main_menu(message: types.Message):
    """Возвращает пользователя в главное меню."""
    user_id = message.from_user.id
    if user_id in user_context:
        del user_context[user_id]

    await message.answer("Возвращаюсь в главное меню.", reply_markup=get_main_menu())
