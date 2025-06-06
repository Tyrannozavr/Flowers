from .bot import dp
from .handlers.start import router as start_router
from .handlers.status import router as status_router
from .handlers.products import router as products_router

dp.include_router(start_router)
dp.include_router(status_router)
dp.include_router(products_router)
