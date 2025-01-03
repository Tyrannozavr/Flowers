import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN не задан в .env файле")

BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://127.0.0.1:8000")
WEBHOOK_HOST = os.getenv("WEBHOOK_HOST", "https://example.com")
WEBHOOK_PATH = f"/webhook/{TELEGRAM_BOT_TOKEN}"
WEBHOOK_URL = f"{WEBHOOK_HOST}{WEBHOOK_PATH}"
