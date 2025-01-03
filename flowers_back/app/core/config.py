from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    UPLOAD_FOLDER: str = "./uploads"
    ALLOWED_EXTENSIONS: list[str] = ["jpg", "jpeg", "png"]
    DEBUG: bool = True
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    SECRET_KEY: str
    TOKEN_EXPIRY_DAYS: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
