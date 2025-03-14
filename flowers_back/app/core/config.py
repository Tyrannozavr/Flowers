from pydantic_settings import BaseSettings


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

    class Config:
        env_file = "/root/flowers/flowers_back/.env"
        env_file_encoding = "utf-8"


settings = Settings()
