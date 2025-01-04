from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.database import engine, Base
from app.routes import shop, auth, category, product
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import get_db
from app.seed.category import seed_categories

def run_seed():
    db = next(get_db())
    seed_categories(db)
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    
    run_seed()

app.include_router(shop.router, prefix="/shops", tags=["Shops"])
app.include_router(product.router, prefix="/products", tags=["Products"])
app.include_router(auth.router)
app.include_router(category.router)

app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static/categories", StaticFiles(directory="categories"), name="categories")

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}
