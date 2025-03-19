from fastapi import APIRouter, HTTPException, Depends, Query, Request

from app.dependencies.Orders import DeliveryDistanceServiceDep
from app.schemas.order import Order, OrderStatus, OrderResponse
from app.models.order import Order as OrderDb
from app.models.shop import Shop 
from app.models.order import OrderItem as OrderItemDb
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db  
from typing import List
from app.repositories import shop as shop_repository

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
        orders = db.query(OrderDb).filter(OrderDb.is_sent == False).all()

        for order in orders:
            order.is_sent = True
        db.commit()

        order_responses = [OrderResponse.from_orm(order) for order in orders]

        return order_responses
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error retrieving orders: {str(e)}")

@router.get("/status", response_model=List[OrderResponse])
async def get_orders_by_status(
    status: OrderStatus = Query(..., description="Фильтр по статусу заказа"),
    db: Session = Depends(get_db),
):
    try:
        orders = db.query(OrderDb).filter(OrderDb.status == status).all()
        order_responses = [OrderResponse.from_orm(order) for order in orders]

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

@router.get("/delivery/cost/{shop_id}")
def get_delivery_cost(
        shop_id: int,
        delivery_distance_service: DeliveryDistanceServiceDep,
        db: Session = Depends(get_db),
):
    shop = shop_repository.get_shop_by_id(db, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Магазин не найден")

    return {"delivery_cost": shop.delivery_cost}