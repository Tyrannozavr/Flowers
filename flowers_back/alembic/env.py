import sys
import os
from dotenv import load_dotenv

load_dotenv()
# Добавляем корневую папку проекта в PYTHONPATH
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Импортируйте модели и базу
from app.core.database import Base
from app.models import product, shop, order, category, user, consultation, pay


# Настройка URL подключения к БД
config = context.config
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))
if config.config_file_name is not None:
    fileConfig(config.config_file_name)
target_metadata = Base.metadata

def run_migrations_offline():
    """Запуск миграций в оффлайн-режиме."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Запуск миграций в онлайн-режиме."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
