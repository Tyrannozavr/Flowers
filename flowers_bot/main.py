from fastapi import FastAPI, Request
from aiogram.types import Update
from app import bot, dp
from app.config import WEBHOOK_URL, WEBHOOK_PATH
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    logging.info(f"Установка вебхука: {WEBHOOK_URL}")
    await bot.set_webhook(WEBHOOK_URL)


@app.on_event("shutdown")
async def on_shutdown():
    logging.info("Удаление вебхука")
    await bot.delete_webhook()


@app.post(WEBHOOK_PATH)
async def webhook(request: Request):
    try:
        raw_update = await request.json()
        logging.info(f"Получено обновление: {raw_update}")
        update = Update(**raw_update)  # Преобразование в объект aiogram.types.Update
        await dp.feed_update(bot, update)  # Передача обработчику
        return {"ok": True}
    except Exception as e:
        logging.error(f"Ошибка при обработке вебхука: {e}")
        return {"ok": False}
