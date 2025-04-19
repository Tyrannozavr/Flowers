from pathlib import Path

from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    UPLOAD_FOLDER: str = "./uploads"
    ALLOWED_EXTENSIONS: list[str] = ["jpg", "jpeg", "png"]
    DEBUG: bool = True
    ADMIN_USERNAME: str = ''
    ADMIN_PASSWORD: str = ''
    SECRET_KEY: str = ''
    TOKEN_EXPIRY_DAYS: int = 0
    T_BANK_TERMINAL_KEY: str = ''
    T_BANK_SECRET: str = ''
    YANDEX_GEOCODER_API_KEY: str = ''
    SMTP_SERVER: str = 'smtp.gmail.com'
    SMTP_PORT: int = 587
    SENDER_EMAIL: str = ''
    SENDER_PASSWORD: str = ''

    class Config:
        env_file = BASE_DIR / ".env"
        env_file_encoding = "utf-8"

settings = Settings()
CATEGORY_IMAGE_UPLOAD_DIR = "categories"
CATEGORY_IMAGE_RETRIEVAL_DIR = "static/categories"
