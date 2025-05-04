from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext
from aiogram import Router, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardRemove
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram import Bot
from utils.api import get_shops_by_user, get_categories, create_product
from app.keyboards import get_main_menu
from aiogram.types import ContentType
from app.handlers.status import user_context

router = Router()

def get_cancel_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Отмена", callback_data="cancel")]]
    )

class ShopState(StatesGroup):
    shop_id = State()
    shop_subdomain = State()

class CategoryState(StatesGroup):
    category_id = State()
    category_name = State()

class BouquetCreation(StatesGroup):
    select_shop = ShopState()
    input_name = State()
    input_description = State()
    input_price = State()
    input_ingredients = State()
    input_category = CategoryState()
    upload_image = State()
    confirm = State()

@router.message(lambda message: message.text == "Создать букет")
async def start_creation(message: types.Message, state: FSMContext):
    user_context[message.from_user.id] = "create_bouquet"

    try:
        # Получаем список магазинов
        shops = await get_shops_by_user(str(message.from_user.id))

        if len(shops) == 0:
            user_context.pop(message.from_user.id, None)
            return await message.answer("У вас пока что нет магазинов.", reply_markup=get_main_menu())

        await state.update_data(user_tg_id=message.from_user.id)

        # Формируем клавиатуру с магазинами
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[
                [InlineKeyboardButton(text=shop["subdomain"], callback_data=f"shop_{shop['id']}")]
                for shop in shops
            ] + [[InlineKeyboardButton(text="Отмена", callback_data="cancel")]]
        )

        # Оставляем клавиатуру с кнопкой "Создать букет" активной
        await message.answer("Выберите магазин для добавления букета:", reply_markup=keyboard)
        await state.set_state(BouquetCreation.select_shop.shop_id)
    except Exception as e:
        # Обрабатываем и отправляем сообщение об ошибке
        user_context.pop(message.from_user.id, None)
        await message.answer(f"Ошибка: {e}", reply_markup=get_main_menu())

@router.callback_query(BouquetCreation.select_shop)
async def select_store(callback: types.CallbackQuery, state: FSMContext):
    if callback.data == "cancel":
        await callback.message.answer("Создание букета отменено.", reply_markup=get_main_menu())
        await state.clear()
        user_context.pop(callback.from_user.id, None)
        return

    try:
        # Получаем ID и имя магазина
        shop_id = callback.data.split("_")[1]
        shops = await get_shops_by_user(callback.from_user.id)
        shop_name = next(shop["subdomain"] for shop in shops if str(shop["id"]) == shop_id)

        await state.update_data(shop_id=shop_id, shop_name=shop_name)
        await callback.message.edit_text(f"Вы выбрали магазин: {shop_name}\n\nВведите название букета:")
        await state.set_state(BouquetCreation.input_name)
    except (IndexError, StopIteration):
        await callback.answer("Некорректный выбор. Попробуйте снова.", show_alert=True)
    except Exception as e:
        # Обрабатываем ошибки от FastAPI
        await callback.message.answer(f"Ошибка: {e}", reply_markup=get_main_menu())
        await state.clear()

@router.message(BouquetCreation.input_name)
async def input_name(message: types.Message, state: FSMContext):
    name = message.text
    await state.update_data(name=name)
    await message.answer("Введите описание букета:")
    await state.set_state(BouquetCreation.input_description)

@router.message(BouquetCreation.input_description)
async def input_description(message: types.Message, state: FSMContext):
    description = message.text
    await state.update_data(description=description)
    await message.answer("Введите цену букета (только цифры):")
    await state.set_state(BouquetCreation.input_price)

@router.message(BouquetCreation.input_price)
async def input_price(message: types.Message, state: FSMContext):
    try:
        price = int(message.text)
        if price <= 0:
            raise ValueError
        await state.update_data(price=price)
        await message.answer("Введите состав букета(ставьте ',' после каждого составляющего без пробела(например: пионы 4 штуки,лента,ромашки)):")
        await state.set_state(BouquetCreation.input_ingredients)
    except ValueError:
        await message.answer("Цена должна быть числом больше нуля. Попробуйте снова.")

@router.message(BouquetCreation.input_ingredients)
async def input_ingredients(message: types.Message, state: FSMContext):
    ingredients = message.text
    await state.update_data(ingredients=ingredients)

    # Получаем сохраненные данные, включая информацию о магазине
    data = await state.get_data()
    shop_subdomain = data.get("shop_name")  # shop_name содержит subdomain магазина

    # Передаем shop_subdomain в функцию get_categories
    categories = await get_categories(shop_subdomain=shop_subdomain)
    if not categories:
        user_context.pop(message.from_user.id, None)
        return await message.answer("Нет доступных категорий.", reply_markup=get_main_menu())

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=category["name"], callback_data=f"category_{category['id']}"),] for category in categories
        ] + [[InlineKeyboardButton(text="Отмена", callback_data="cancel")]]
    )

    await message.answer("Выберите категорию букета:", reply_markup=keyboard)
    await state.set_state(BouquetCreation.input_category.category_id)

@router.callback_query(BouquetCreation.input_category)
async def select_category(callback: types.CallbackQuery, state: FSMContext):
    if callback.data == "cancel":
        await callback.message.answer("Создание букета отменено.", reply_markup=get_main_menu())
        await state.clear()
        user_context.pop(callback.from_user.id, None)
        return

    try:
        # Получаем данные из состояния
        data = await state.get_data()
        shop_subdomain = data.get("shop_name")  # shop_name содержит subdomain магазина
        
        category_id = callback.data.split("_")[1]
        # Передаем shop_subdomain в функцию get_categories
        categories = await get_categories(shop_subdomain=shop_subdomain)
        category_name = next(category["name"] for category in categories if str(category["id"]) == category_id)
    except (IndexError, StopIteration):
        await callback.answer("Некорректный выбор. Попробуйте снова.", show_alert=True)
        return

    await state.update_data(category_id=category_id, category_name=category_name)
    await callback.message.edit_text(f"Вы выбрали категорию: {category_name}\n\nЗагрузите изображение букета:")
    await state.set_state(BouquetCreation.upload_image)

@router.message(BouquetCreation.upload_image, lambda message: message.content_type == ContentType.PHOTO)
async def upload_image(message: types.Message, state: FSMContext):
    photo = message.photo[-1]
    file_id = photo.file_id
    await state.update_data(image_id=file_id)

    data = await state.get_data()

    confirmation_message = (
        f"Проверьте данные:\n\n"
        f"Магазин: {data['shop_name']}\n"
        f"Название: {data['name']}\n"
        f"Описание: {data['description']}\n"
        f"Цена: {data['price']} руб.\n"
        f"Состав: {data['ingredients']}\n"
        f"Категория: {data['category_name']}\n\n"
        "Все верно?"
    )

    builder = InlineKeyboardBuilder()
    builder.add(InlineKeyboardButton(text="Да", callback_data="confirm"))
    builder.add(InlineKeyboardButton(text="Нет", callback_data="cancel"))

    await message.answer(confirmation_message, reply_markup=builder.as_markup())
    await state.set_state(BouquetCreation.confirm)

@router.callback_query(BouquetCreation.confirm)
async def confirm_creation(callback: types.CallbackQuery, state: FSMContext, bot: Bot):
    if callback.data == "cancel":
        user_context.pop(callback.from_user.id, None)
        await callback.message.edit_text("Создание букета отменено.")
        await callback.message.answer("Операция отменена.", reply_markup=get_main_menu())
        await state.clear()
        return

    if callback.data == "confirm":
        data = await state.get_data()

        try:
            response = await create_product(data, bot)
            user_context.pop(callback.from_user.id, None)
            await state.clear()
            await callback.message.answer(f"Букет успешно создан!", reply_markup=get_main_menu())
        except Exception as e:
            await state.clear()
            user_context.pop(callback.from_user.id, None)
            await callback.message.answer(f"Ошибка при создании букета: {e}", reply_markup=get_main_menu())
            return

