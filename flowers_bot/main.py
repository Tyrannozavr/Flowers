import logging
import asyncio
from fastapi import FastAPI, Request
from aiogram.types import Update
from app.bot import bot, dp
from app.config import WEBHOOK_URL, TELEGRAM_BOT_TOKEN
from utils.orders import send_new_orders

logging.basicConfig(level=logging.INFO)

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    logging.info(f"Установка вебхука: {WEBHOOK_URL}")
    await bot.set_webhook(WEBHOOK_URL)

    asyncio.create_task(send_new_orders())

@app.on_event("shutdown")
async def on_shutdown():
    logging.info("Удаление вебхука")
    await bot.delete_webhook()



@app.post(f"/webhook/{TELEGRAM_BOT_TOKEN}")
async def webhook(request: Request):
    try:
        raw_update = await request.json()
        logging.info(f"Входящее обновление: {raw_update}")
        update = Update(**raw_update)
        await dp.feed_update(bot, update)
        return {"ok": True}
    except Exception as e:
        logging.error(f"Ошибка при обработке вебхука: {e}")
        return {"ok": False}