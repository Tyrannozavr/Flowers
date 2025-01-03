from aiogram import Router, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import default_state
from aiogram.filters import StateFilter
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from fastapi.logger import logger

from app.states import CreateShopState
import httpx
from app.config import BACKEND_API_URL
from app.keyboards import get_shop_buttons

router = Router()

@router.callback_query()
async def debug_callback(callback: types.CallbackQuery):
    logger.info(f"Callback data: {callback.data}")
    await callback.message.answer(f"Получен callback: {callback.data}")
    await callback.answer()

# Обработка кнопки "Добавить магазин"
@router.message(StateFilter(default_state), lambda message: message.text == "➕ Добавить магазин")
async def start_create_shop(message: types.Message, state: FSMContext):
    await state.clear()

    await message.answer("Введите поддомен для нового магазина:")
    await state.set_state(CreateShopState.waiting_for_subdomain)

# Обработка выбора магазина
@router.callback_query(lambda c: c.data.startswith("shop:"))
async def shop_actions(callback: types.CallbackQuery):
    logger.info(f"Callback data received: {callback.data}")
    shop_id = callback.data.split(":")[1]

    # Кнопки действий для магазина
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton("Редактировать", callback_data=f"edit:{shop_id}")],
        [InlineKeyboardButton("Удалить", callback_data=f"delete:{shop_id}")],
        [InlineKeyboardButton("Назад к списку", callback_data="list_shops")]
    ])
    await callback.message.edit_text(f"Вы выбрали магазин ID: {shop_id}. Что вы хотите сделать?", reply_markup=markup)

# Обработка кнопки "Назад к списку"
@router.callback_query(lambda c: c.data == "list_shops")
async def back_to_list(callback: types.CallbackQuery):
    await list_shops(callback.message)

# Обработка редактирования магазина
@router.callback_query(lambda c: c.data.startswith("edit:"))
async def edit_shop(callback: types.CallbackQuery):
    shop_id = callback.data.split(":")[1]
    await callback.message.edit_text(f"Редактирование магазина ID: {shop_id}. Пока функционал в разработке.")

# Обработка удаления магазина
@router.callback_query(lambda c: c.data.startswith("delete:"))
async def delete_shop(callback: types.CallbackQuery):
    shop_id = callback.data.split(":")[1]

    # Удаление магазина через бэкенд
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.delete(f"{BACKEND_API_URL}/shops/{shop_id}")
            response.raise_for_status()
        await callback.message.edit_text(f"Магазин ID: {shop_id} успешно удалён.")
        await list_shops(callback.message)
    except Exception:
        await callback.message.edit_text("Не удалось удалить магазин. Попробуйте позже.")


@router.message(StateFilter(default_state), lambda message: message.text == "🛍 Список магазинов")
async def list_shops(message: types.Message, state: FSMContext):
    await state.clear()

    # Получение списка магазинов из бэкенда
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(f"{BACKEND_API_URL}/shops/")
            response.raise_for_status()
            print(response.json())
            shops = response.json()

        if not shops:
            await message.answer("У вас пока нет магазинов.")
            return

        # Генерация inline-кнопок для магазинов
        markup = get_shop_buttons(shops)
        await message.answer("Выберите магазин:", reply_markup=markup)
    except Exception as e:
        logger.error(e)
        await message.answer("Не удалось загрузить список магазинов. Попробуйте позже.")

# Обработка ввода поддомена
@router.message(StateFilter(CreateShopState.waiting_for_subdomain))
async def enter_subdomain(message: types.Message, state: FSMContext):
    subdomain = message.text.strip()

    if not subdomain.isalnum():
        await message.answer("Поддомен должен содержать только буквы и цифры. Попробуйте снова.")
        return

    await state.update_data(subdomain=subdomain)
    await message.answer("Введите акцентный цвет в формате HEX (например, #FF5733):")
    await state.set_state(CreateShopState.waiting_for_color)

# Обработка ввода акцентного цвета
@router.message(StateFilter(CreateShopState.waiting_for_color))
async def enter_color(message: types.Message, state: FSMContext):
    color = message.text.strip()

    if not (len(color) == 7 and color.startswith("#") and all(c in "0123456789ABCDEFabcdef" for c in color[1:])):
        await message.answer("Неверный формат HEX цвета. Попробуйте снова.")
        return

    await state.update_data(color=color)
    await message.answer("Теперь отправьте логотип магазина в виде изображения.")
    await state.set_state(CreateShopState.waiting_for_logo)

# Обработка загрузки логотипа
@router.message(StateFilter(CreateShopState.waiting_for_logo))
async def enter_logo(message: types.Message, state: FSMContext):
    if message.content_type == "photo":
        # Обработка, если файл отправлен как изображение
        photo = message.photo[-1]
        file_id = photo.file_id
    elif message.content_type == "document" and message.document.mime_type.startswith("image/"):
        # Обработка, если файл отправлен как документ с изображением
        file_id = message.document.file_id
    else:
        # Если файл не изображение
        await message.answer("Пожалуйста, отправьте логотип в виде изображения (фото или файл с изображением).")
        return

    # Получаем информацию о файле
    file_info = await message.bot.get_file(file_id)
    file_path = file_info.file_path

    # Загружаем файл
    file = await message.bot.download_file(file_path)

    # Данные магазина из FSM
    data = await state.get_data()
    subdomain = data["subdomain"]
    color = data["color"]

    # Отправляем данные на бэкенд
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            files = {"logo": ("logo.jpg", file, "image/jpeg")}
            payload = {"subdomain": subdomain, "color": color}
            response = await client.post(f"{BACKEND_API_URL}/shops/", data=payload, files=files)
            response.raise_for_status()

        await message.answer(f"Магазин '{subdomain}' успешно создан!")
    except httpx.HTTPStatusError as http_err:
        if http_err.response.status_code == 400:
            error_detail = http_err.response.json().get("detail", "Произошла ошибка")
            await message.answer(f"Ошибка: {error_detail}")
        else:
            await message.answer(f"Произошла ошибка: {http_err}")
    except Exception:
        await message.answer(f"Произошла ошибка при создании магазина")
    finally:
        await state.clear()
