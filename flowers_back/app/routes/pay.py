import hashlib
import json
import os
from datetime import datetime, timedelta
import time

import requests
from fastapi import APIRouter, HTTPException, status, Depends, Header, Request
from dotenv import load_dotenv
from app.models.user import User
from app.models.pay import Pay
from app.models.shop import Shop
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.routes.auth import decode_token
from pydantic import BaseModel

from urllib.parse import unquote

load_dotenv()

router = APIRouter()


@router.get('/check')
async def check(request: Request, db: Session = Depends(get_db)):
    answer = {}
    user_id = request.query_params.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='user_id is reqiured')

    find_pay_info = db.query(Pay).filter(Pay.user_id == user_id).order_by(Pay.id.desc()).first()
    if not find_pay_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pay info not found")

    payment_status = find_pay_info.status
    answer['currentStatus'] = payment_status

    try:
        ts = find_pay_info.timestamp
        if ts:
            answer['until'] = ts + timedelta(minutes=5)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid timestamp format")

    pan = find_pay_info.pan
    if pan:
        answer['pan'] = pan

    return answer


@router.get("/init")
async def pay_init(request: Request, db: Session = Depends(get_db)):
    user_id = request.query_params.get("user_id")
    user_email = request.query_params.get("user_email")
    back_url = unquote(request.query_params.get("back_url"))
    find_user = db.query(User).filter(User.id == user_id).first()
    if not find_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # не инкрементирует поэтому костыль
    last_id_pay = db.query(Pay).order_by(Pay.id.desc()).first()

    if last_id_pay:
        last_id = last_id_pay.id
    else:
        last_id = 0

    last_id += 1

    init_pay = Pay(
        id=last_id,
        user_id=user_id,
        status='init',
        email=user_email,
    )

    db.add(init_pay)
    db.commit()
    db.refresh(init_pay)

    if not init_pay.id:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create payment")

    payment_amount = 990 * 100  # в копейках

    order_id = f'{user_id}-{init_pay.id}-{int(time.time())}'
    description = f"Оплата заказа №{init_pay.id}"
    success_url = back_url
    fail_url = back_url

    terminal_key = os.getenv('T_BANK_TERMINAL_KEY')
    secret_key = os.getenv('T_BANK_SECRET')

    receipt = {
        'Items': [
            {
                'Name': 'Подписка',
                'Price': payment_amount,
                'Quantity': 1,
                'Amount': payment_amount,
                'Tax': 'none',
            }
        ],
        'Email': user_email,
        'Taxation': 'osn',
    }

    data = {
        "TerminalKey": terminal_key,
        "Amount": payment_amount,
        "OrderId": order_id,
        "Description": description,
        "SuccessURL": success_url,
        "FailURL": fail_url,
        "NotificationURL": "https://api.flourum.ru/pay/notification",
        "CustomerKey": str(user_id),
        "DATA": {
            "Email": user_email
        },
        "Receipt": receipt,
        "Recurrent": 'Y',
    }

    data_for_token = [
        {'TerminalKey': terminal_key},
        {'Amount': payment_amount},
        {'OrderId': order_id},
        {'Description': description},
        {'Password': secret_key},
        {'Recurrent': 'Y'}
    ]

    hashed_token = generate_token(d=data_for_token)
    data['Token'] = hashed_token

    url = "https://securepay.tinkoff.ru/v2/Init"
    response = requests.post(url, json=data)

    pay_url = ''

    if response.status_code == 200:
        response_data = response.json()
        if response_data.get('Success'):
            pay_url = response_data.get('PaymentURL')

            init_pay.status = response_data.get('Status')
            init_pay.payment_id = response_data.get('PaymentId')
            init_pay.order_id = order_id

            db.commit()
            db.refresh(init_pay)

            if not init_pay.id:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error refreshing pay info")
        else:
            print("Ошибка инициализации платежа:", response_data.get("Message"))
    else:
        print("Ошибка запроса:", response.status_code, response.text)

    return {'url': pay_url}


@router.get("/cancel")
async def pay_cancel(request: Request, db: Session = Depends(get_db)):
    user_id = request.query_params.get("user_id")
    find_pay_info = db.query(Pay).filter(User.id == user_id).order_by(Pay.id.desc()).first()
    if not find_pay_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pay info not found")

    new_status = 'canceled_by_user'

    find_pay_info.status = new_status
    db.commit()
    db.refresh(find_pay_info)
    if not find_pay_info.id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error refreshing pay info"
        )

    return {'currentStatus': find_pay_info.status}


@router.post('/notification')
async def notification(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    with open("notification_data.json", "a") as file:
        file.write(json.dumps(data, ensure_ascii=False) + "\n")

    order_id = data.get('OrderId')
    new_status = data.get('Status')

    payment = db.query(Pay).filter(Pay.order_id == order_id).first()

    if not payment.id:
        return 'ok'

    if payment.status == 'canceled_by_user':
        return 'ok'

    if payment.status == 'CONFIRMED':
        return 'ok'

    if not data.get('Success'):
        payment.status = new_status
        db.commit()
        db.refresh(payment)
        return 'ok'

    payment.card_id = data.get('CardId')
    if data.get('RebillId'):
        payment.rebill_id = data.get('RebillId')
    payment.pan = data.get('Pan')
    payment.status = new_status

    if new_status == 'CONFIRMED':
        payment.timestamp = datetime.now()

    db.commit()
    db.refresh(payment)

    return 'ok'


def generate_token(d):
    sorted_data = sorted(d, key=lambda item: list(item.keys())[0])
    concatenated_values = ''.join(str(list(item.values())[0]) for item in sorted_data)
    hash_object = hashlib.sha256(concatenated_values.encode('utf-8'))
    hashed_token = hash_object.hexdigest()
    return hashed_token


def get_pays(db: Session):
    return db.query(Pay).order_by(Pay.id.desc()).all()


@router.get('/get_all')
def get_all(request: Request, db: Session = Depends(get_db)):
    return get_pays(db)

@router.post('/refund')
async def refund(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    payment_id = data.get("payment_id")
    if payment_id:
        payment = db.query(Pay).filter(Pay.payment_id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pay info not found")
        else:
            payment_amount = 990 * 100

            receipt = {
                'Items': [
                    {
                        'Name': 'Подписка',
                        'Price': payment_amount,
                        'Quantity': 1,
                        'Amount': payment_amount,
                        'Tax': 'none',
                    }
                ],
                'Taxation': 'osn',
            }
            if payment.email:
                receipt['Email'] = payment.email

            terminal_key = os.getenv('T_BANK_TERMINAL_KEY')
            secret_key = os.getenv('T_BANK_SECRET')

            data = {
                "TerminalKey": terminal_key,
                "PaymentId": payment_id,
                "Receipt": receipt,
            }

            data_for_token = [
                {'TerminalKey': terminal_key},
                {'PaymentId': payment_id},
                {'Password': secret_key},
            ]

            hashed_token = generate_token(d=data_for_token)
            data['Token'] = hashed_token

            url = "https://securepay.tinkoff.ru/v2/Cancel"
            response = requests.post(url, json=data)

            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('Success'):

                    payment.status = response_data.get("Status")

                    db.commit()
                    db.refresh(payment)

                    if not payment.id:
                        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                            detail="Error refreshing pay info")
                else:
                    print("Ошибка отмены платежа:", response_data.get("Message"))
            else:
                print("Ошибка запроса:", response.status_code, response.text)

    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pay info not found")


    print(f'refund {payment_id}')
