from fastapi import FastAPI, HTTPException
import requests

app = FastAPI()

YOOKASSA_SHOP_ID = "ваш_shop_id"  # Ваш ID магазина из YooKassa
YOOKASSA_SECRET_KEY = "ваш_secret_key"  # Секретный ключ из YooKassa

@app.post("/create-payment/")
def create_payment(amount: float, description: str):
    """
    Создать платеж через YooKassa с использованием СБП
    """
    url = "https://api.yookassa.ru/v3/payments"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {YOOKASSA_SECRET_KEY}"
    }
    data = {
        "amount": {
            "value": f"{1:.2f}",  # Сумма в рублях
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",  # YooKassa предоставит ссылку на оплату
            "return_url": "http://localhost:5437/"
        },
        "capture": True,
        "description": description,
        "payment_method_data": {
            "type": "sbp"  # Указываем СБП как метод оплаты
        }
    }
    response = requests.post(url, json=data, headers=headers, auth=(YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY))
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())
