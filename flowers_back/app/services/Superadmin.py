from importlib import import_module

from fastapi.params import Depends
from sqlalchemy.orm import Session
from starlette_admin.contrib.sqla import Admin, ModelView

from app.core.database import engine, get_db
from app.models import User
from app.routes.admin import get_current_user, get_user_by_token
from app.routes.auth import decode_token

models_module = import_module("app.models")

from fastapi import Request, APIRouter
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi import status

class AdminAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Проверяем, начинается ли путь с /admin
        if request.url.path.startswith("/admin"):
            # Проверка токена или сессии
            token = request.cookies.get("access_token")
            if not token:
                return RedirectResponse("superadmin/login", status_code=status.HTTP_303_SEE_OTHER)

            # Проверка прав пользователя
            try:
                db_session = next(get_db())
                user = get_user_by_token(token, db=db_session)  # Функция для получения пользователя
                db_session.close()
                if not user.is_superadmin:
                    return JSONResponse(status_code=403, content={"detail": "Forbidden"})
            except Exception as e:
                return JSONResponse(status_code=401, content={"detail": str(e)})

        # Продолжаем обработку запроса
        response = await call_next(request)
        return response

# Настройка Starlette Admin
admin = Admin(engine, title="Admin Panel")



# Регистрируем все модели из списка __all__
for model_name in models_module.__all__:
    model = getattr(models_module, model_name)
    admin.add_view(ModelView(model, icon="fas fa-table"))  # Иконка для всех моделей