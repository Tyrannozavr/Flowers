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
        """
        Dispatch method for the AdminAuthMiddleware.
    
        This method intercepts requests to the admin panel, verifies user authentication
        and authorization, and handles the request accordingly.
    
        Parameters:
        -----------
        request : Request
            The incoming HTTP request object.
        call_next : Callable
            The next middleware or route handler in the chain.
    
        Returns:
        --------
        Response
            The HTTP response, which could be a redirect, a JSON response, or the result
            of calling the next handler in the chain.
    
        Notes:
        ------
        - If the request path starts with "/admin", it checks for an access token in cookies.
        - If no token is found, it redirects to the login page.
        - If a token is found, it verifies if the user is a superadmin.
        - If the user is not a superadmin, it returns a 403 Forbidden response.
        - For non-admin routes or after successful authorization, it calls the next handler.
        """
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


# from starlette_admin import BaseAdmin, fields
#
# class ProductAdmin(BaseAdmin):
#     list_display = ["id", "name", "shop_name"]
#     form_fields = [
#         fields.StringField("name", label="Product Name"),
#         fields.ForeignKeyField("shop_id", label="Shop", model=Shop, display_field="name"),
#     ]
#
#     def shop_name(self, obj):
#         return obj.shop.name if obj.shop else None
#
#     shop_name.short_description = "Shop Name"
# admin.add_view(ProductAdmin(Product))
