from aiogram.fsm.state import State, StatesGroup

class CreateShopState(StatesGroup):
    waiting_for_subdomain = State()
    waiting_for_color = State()
    waiting_for_logo = State()
