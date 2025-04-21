#!/bin/bash

# Запуск cron
cron

# Apply database migrations
alembic upgrade head

# Запуск uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000
