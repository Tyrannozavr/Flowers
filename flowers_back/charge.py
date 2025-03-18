import json
from datetime import datetime, timedelta
from app.routes.pay import get_pays
from app.routes.pay import generate_token
from app.core.database import SessionLocal
from app.models.user import User
from app.models.pay import Pay
import requests
from app.core.config import settings
import time


def charge():
    print(f'{datetime.now()}')
    db = SessionLocal()
    try:
        res = get_pays(db)
        users = []
        for el in res:
            if el.user_id in users:
                continue
            if not el.timestamp:
                continue
            users.append(el.user_id)
            # now = datetime.now().date()
            now = datetime.now()
            # time_pay_delta = now - el.timestamp.date()
            time_pay_delta = now - el.timestamp
            rebill_id = el.rebill_id
            # if time_pay_delta >= timedelta(days=30) and el.status != 'canceled_by_user':
            if time_pay_delta >= timedelta(minutes=5) and el.status != 'canceled_by_user':
                user_id = el.user_id
                user_email = el.email
                back_url = 'https://admin.flourum.ru/profile'
                find_user = db.query(User).filter(User.id == user_id).first()
                if not find_user:
                    print('1 юзер не найден')
                    continue
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
                    status='subscription_init',
                    email=user_email,
                    rebill_id=rebill_id,
                )
                db.add(init_pay)
                db.commit()
                db.refresh(init_pay)
                if not init_pay.id:
                    print('2 ошибка создания init_pay')
                    continue
                payment_amount = 990 * 100  # в копейках
                order_id = f'{user_id}-{init_pay.id}-rebill-{int(time.time())}'
                description = f"Оплата заказа №{init_pay.id}. Продление подписки."
                success_url = back_url
                fail_url = back_url

                terminal_key = settings.T_BANK_TERMINAL_KEY
                secret_key = settings.T_BANK_SECRET

                receipt = {
                    'Items': [
                        {
                            'Name': 'Продление подписки Flourum',
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
                    "DATA": {
                        "Email": user_email
                    },
                    "Receipt": receipt,
                }

                data_for_token = [
                    {'TerminalKey': terminal_key},
                    {'Amount': payment_amount},
                    {'OrderId': order_id},
                    {'Description': description},
                    {'Password': secret_key},
                ]

                hashed_token = generate_token(d=data_for_token)
                data['Token'] = hashed_token

                url = "https://securepay.tinkoff.ru/v2/Init"
                response = requests.post(url, json=data)
                if response.status_code == 200:
                    response_data = response.json()
                    if response_data.get('Success'):

                        payment_id = response_data.get('PaymentId')
                        init_pay.status = response_data.get('Status')
                        init_pay.payment_id = payment_id
                        init_pay.order_id = order_id

                        db.commit()
                        db.refresh(init_pay)

                        if not init_pay.id:
                            print('5 ошибка обновления init pay')

                        data_charge = {
                            'TerminalKey': terminal_key,
                            'PaymentId': payment_id,
                            'RebillId': rebill_id,
                        }
                        data_for_token_charge = [
                            {'TerminalKey': terminal_key},
                            {'PaymentId': payment_id},
                            {'RebillId': rebill_id},
                            {'Password': secret_key}
                        ]
                        data_charge['Token'] = generate_token(d=data_for_token_charge)
                        res_charge = requests.post('https://securepay.tinkoff.ru/v2/Charge', json=data_charge)
                        if res_charge.status_code == 200:
                            response_data_charge = res_charge.json()
                            if response_data_charge.get('Success'):
                                init_pay.timestamp = datetime.now()
                                db.commit()
                                db.refresh(init_pay)
                                print(f'8 {json.dumps(response_data_charge)}')
                            else:
                                print(f'7 ошибка charge {json.dumps(response_data_charge)}')
                        else:
                            print(f'6 Ошибка запроса: {res_charge.status_code, res_charge.text}')
                    else:
                        print(f'4 Ошибка инициализации платежа: {response_data.get("Message")}')
                else:
                    print(f'5 Ошибка запроса: {response.status_code, response.text}')
    finally:
        db.close()
    print(f' ~~~~~~~~ ')


charge()
