from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends, Query, Request, Body
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.dependencies.Orders import DeliveryDistanceServiceDep
from app.dependencies.Shops import ShopByOwnerDep
from app.dependencies.subdomain import ShopDep
from app.models.order import Order as OrderDb, OrderItem, AddressModel
from app.models.order import OrderItem as OrderItemDb
from app.models.shop import Shop
from app.repositories import shop as shop_repository
from app.schemas.order import Order, OrderStatus, OrderResponse
from app.core.config import settings
from app.services.Geo import YandexGeoService

router = APIRouter()


@router.post("/")
async def create_order(request: Request, order: Order, db: Session = Depends(get_db)):
    try:
        subdomain = request.headers.get("X-Subdomain")
        if not subdomain:
            raise HTTPException(status_code=400, detail="Subdomain header is required")

        shop = db.query(Shop).filter(Shop.subdomain == subdomain).first()
        if not shop:
            raise HTTPException(status_code=404, detail="Магазин не найден")

        
        db_order = OrderDb(
            full_name=order.fullName,
            phone_number=order.phoneNumber,
            recipient_name=order.recipientName,
            recipient_phone=order.recipientPhone,
            city=order.city,
            street=order.street,
            status=OrderStatus.NOT_PAID,
            house=order.house,
            building=order.building,
            apartment=order.apartment,
            delivery_method=order.deliveryMethod,
            delivery_date=order.deliveryDate,
            delivery_time=order.deliveryTime,
            wishes=order.wishes,
            card_text=order.cardText,
            is_self_pickup=order.isSelfPickup,
            shop_id=shop.id
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        for item in order.items:
            db_item = OrderItemDb(
                order_id=db_order.id,
                product_id=item.id,
                name=item.name,
                price=item.price,
                quantity=item.quantity,
            )
            db.add(db_item)

        db.commit()

        return {"message": "Order created successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing order: {str(e)}")


@router.get("/", response_model=List[OrderResponse])
async def get_orders(db: Session = Depends(get_db)):
    try:
        orders = db.query(OrderDb).options(joinedload(OrderDb.items)).filter(OrderDb.is_sent == False).all()

        for order in orders:
            order.is_sent = True
        db.commit()

        order_responses = []
        for order in orders:
            order_items = [OrderItem(
                id=item.product_id,
                name=item.name,
                price=item.price,
                quantity=item.quantity
            ) for item in order.items]

            order_response = OrderResponse(
                id=order.id,
                fullName=order.full_name,
                phoneNumber=order.phone_number,
                recipientName=order.recipient_name,
                recipientPhone=order.recipient_phone,
                city=order.city,
                street=order.street,
                house=order.house,
                building=order.building,
                apartment=order.apartment,
                deliveryMethod=order.delivery_method,
                deliveryDate=order.delivery_date,
                deliveryTime=order.delivery_time,
                wishes=order.wishes,
                cardText=order.card_text,
                isSelfPickup=order.is_self_pickup,
                status=order.status,
                isSent=order.is_sent,
                items=order_items,
                shop_id=order.shop_id
            )
            order_responses.append(order_response)

        return order_responses
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error retrieving orders: {str(e)}")


@router.get("/shop", response_model=List[OrderResponse])
async def get_orders_by_shop(
        shop: ShopByOwnerDep,
        db: Session = Depends(get_db),
        search: Optional[str] = Query(None, description="Search by recipient name"),
):
    try:
        orders = db.query(OrderDb).options(joinedload(OrderDb.items)).filter(OrderDb.shop_id == shop.id)
        if search:
            search_term = f"%{search}%"
            orders = orders.filter(
                or_(
                    OrderDb.recipient_name.ilike(search_term),
                    OrderDb.full_name.ilike(search_term)
                )
            )
        order_responses = []
        for order in orders.all():
            order_items = [OrderItem(
                id=item.product_id,
                name=item.name,
                price=item.price,
                quantity=item.quantity
            ) for item in order.items]

            order_response = OrderResponse(
                id=order.id,
                fullName=order.full_name,
                phoneNumber=order.phone_number,
                recipientName=order.recipient_name,
                recipientPhone=order.recipient_phone,
                city=order.city,
                street=order.street,
                house=order.house,
                building=order.building,
                apartment=order.apartment,
                deliveryMethod=order.delivery_method,
                deliveryDate=order.delivery_date,
                deliveryTime=order.delivery_time,
                wishes=order.wishes,
                cardText=order.card_text,
                isSelfPickup=order.is_self_pickup,
                status=order.status,
                isSent=order.is_sent,
                items=order_items,
                shop_id=order.shop_id
            )
            order_responses.append(order_response)

        return order_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving orders: {str(e)}")


@router.get("/status", response_model=List[OrderResponse])
async def get_orders_by_status(
        status: OrderStatus = Query(..., description="Фильтр по статусу заказа"),
        db: Session = Depends(get_db),
):
    try:
        orders = db.query(OrderDb).options(joinedload(OrderDb.items)).filter(OrderDb.status == status).all()
        
        order_responses = []
        for order in orders:
            order_items = [OrderItem(
                id=item.product_id,
                name=item.name,
                price=item.price,
                quantity=item.quantity
            ) for item in order.items]

            order_response = OrderResponse(
                id=order.id,
                fullName=order.full_name,
                phoneNumber=order.phone_number,
                recipientName=order.recipient_name,
                recipientPhone=order.recipient_phone,
                city=order.city,
                street=order.street,
                house=order.house,
                building=order.building,
                apartment=order.apartment,
                deliveryMethod=order.delivery_method,
                deliveryDate=order.delivery_date,
                deliveryTime=order.delivery_time,
                wishes=order.wishes,
                cardText=order.card_text,
                isSelfPickup=order.is_self_pickup,
                status=order.status,
                isSent=order.is_sent,
                items=order_items,
                shop_id=order.shop_id
            )
            order_responses.append(order_response)

        return order_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving orders: {str(e)}")


@router.put("/{order_id}")
async def update_order_status(
        order_id: int,
        status: OrderStatus = Query(..., description="Новый статус заказа"),
        db: Session = Depends(get_db),
):
    """
    Обновляет статус заказа по ID.
    """
    try:
        order = db.query(OrderDb).filter(OrderDb.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail=f"Order with ID {order_id} not found")

        order.status = status
        db.commit()
        db.refresh(order)

        return {"message": f"Order {order_id} status updated to {status}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating order status: {str(e)}")



# Проверка на существование адреса
@router.post("/validate-address")
async def validate_address(
    address: AddressModel,
    db: Session = Depends(get_db)
):
    """
    Проверяет существование адреса через Яндекс.Геокодер
    """
    print("validate-address","="*40, address, "="*40)
    try:
        address_str = address.to_address_string(without_building=True, without_apartment=True)
        geo_service = YandexGeoService(api_key=settings.YANDEX_GEOCODER_API_KEY)
        is_valid = geo_service.validate_address(address_str)
        
        if is_valid:
            message = "Адрес найден и существует. Доставка возможна по указанному адресу."
        else:
            message = "Указанный адрес не найден или не соответствует действительности. Пожалуйста, проверьте правильность ввода всех частей адреса (город, улица, дом)."
        
        return {
            "isValid": is_valid,
            "message": message
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при проверке адреса: {str(e)}")

@router.post("/delivery-cost")
async def calculate_delivery_cost(
    shop_id: int = Body(...),
    address: AddressModel = Body(...),
    db: Session = Depends(get_db)
):
    print("delivery-cost", "="*40, address, "="*40)
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop or not shop.delivery_cost:
        raise HTTPException(status_code=404, detail="Магазин или доставка не найдены")

    # Фиксированная стоимость
    if shop.delivery_cost.fixed_cost is not None:
        return {"cost": shop.delivery_cost.fixed_cost}

    # Радиусная доставка
    if shop.delivery_cost.radius_cost:
        from app.services.Geo import YandexGeoService
        geo_service = YandexGeoService(api_key=settings.YANDEX_GEOCODER_API_KEY)
        shop_address = shop.addresses[0]['address'] if shop.addresses else None
        if not shop_address:
            raise HTTPException(status_code=400, detail="У магазина не указан адрес")
        distance = geo_service.calculate_distance(shop_address, address.to_address_string())

        # Дистаниця: 4.5
        # Радиус: 1, 5, 10, 20
        for radius, cost in sorted(shop.delivery_cost.radius_cost.items(), key=lambda x: float(x[0])):
            if distance <= float(radius):
                return {"cost": cost}
        return {"cost": max(shop.delivery_cost.radius_cost.values())}

    # Яндекс Go
    if getattr(shop.delivery_cost, "is_yandex_geo", False):
        return {"cost": 0}

    raise HTTPException(status_code=400, detail="Не удалось рассчитать стоимость доставки")
