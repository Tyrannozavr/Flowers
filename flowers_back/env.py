import os
from alembic import context
from logging.config import fileConfig
from app.core.database import Base

# Настройка логирования
config = context.config
fileConfig(config.config_file_name)

# Получение строки подключения из переменной окружения
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL)

target_metadata = Base.metadata
