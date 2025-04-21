FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Установка необходимых пакетов
RUN apt-get update && \
    apt-get install -y libpq-dev gcc cron && \
    rm -rf /var/lib/apt/lists/*

# Установка зависимостей Python
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY . .

# Настройка cron
COPY crontab /etc/cron.d/mycron
RUN chmod 0644 /etc/cron.d/mycron && \
    crontab /etc/cron.d/mycron && \
    touch /app/cron.log

# Скрипт запуска cron и uvicorn
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8000

# Запуск приложения
CMD ["/entrypoint.sh"]
