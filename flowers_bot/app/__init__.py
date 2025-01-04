from .bot import dp
from .handlers.start import router as start_router
from .handlers.status import router as status_router

dp.include_router(start_router)
dp.include_router(status_router)