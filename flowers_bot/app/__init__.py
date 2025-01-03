from .bot import bot, dp
from .handlers.start import router as start_router
from .handlers.shops import router as shops_router

# Подключаем маршруты
dp.include_router(shops_router)
dp.include_router(start_router)
