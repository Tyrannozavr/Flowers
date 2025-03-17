#!/bin/bash

# Запуск cron
cron

# Запуск uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000
