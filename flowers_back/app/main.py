from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.core.database import engine, Base
from app.core.database import get_db
from app.routes import shop, auth, category, product, consultation, order, pay
from app.routes import admin as admin_router
from app.routes import superadmin
from app.seed.admin import create_superadmin
from app.seed.category import seed_categories
from app.services.Superadmin import admin, AdminAuthMiddleware


def run_seed():
    db = next(get_db())
    create_superadmin()
    seed_categories(db)


app = FastAPI()


# Подключение Starlette Admin к FastAPI
admin.mount_to(app)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="API для работы с магазинами",
        version="1.0.0",
        description="Документация API для авторизованных запросов",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AdminAuthMiddleware)

@app.on_event("startup")
async def startup():
    # Создание таблиц в базе данных
    Base.metadata.create_all(bind=engine)

    # Запуск сидов (начальных данных)
    run_seed()


# Подключение роутеров
app.include_router(shop.router, prefix="/shops", tags=["Shops"])
app.include_router(product.router, prefix="/products", tags=["Products"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(admin_router.router, prefix="/admins", tags=["Admin"])
app.include_router(category.router, prefix="/categories", tags=["Category"])
app.include_router(consultation.router, prefix="/consultations", tags=["Consultations"])
app.include_router(order.router, prefix="/orders", tags=["Orders"])
app.include_router(pay.router, prefix="/pay", tags=["Pay"])
app.include_router(superadmin.router, prefix="/superadmin", tags=["Superadmin"])

# Монтирование статических файлов
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static/categories", StaticFiles(directory="categories"), name="categories")
templates = Jinja2Templates(directory="templates")


@app.get("/")
def read_root():
    return {"message": "Backend is working!"}