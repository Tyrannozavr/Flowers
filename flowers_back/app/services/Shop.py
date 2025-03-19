from app.dependencies.Shops import DeliveryCostType, ShopDeliveryCostCreate
from app.models.shop import ShopDeliveryCost


def create_shop_delivery_cost(delivery_cost: ShopDeliveryCostCreate):
    if delivery_cost.type == DeliveryCostType.FIXED:
        return ShopDeliveryCost(type=delivery_cost.type.value, fixed_cost=delivery_cost.fixed_cost)
    elif delivery_cost.type == DeliveryCostType.RADIUS:
        return ShopDeliveryCost(type=delivery_cost.type.value, radius_cost=delivery_cost.radius_cost)
    elif delivery_cost.type == DeliveryCostType.YANDEX_GO:
        return ShopDeliveryCost(type=delivery_cost.type.value)
    else:
        raise ValueError("Invalid delivery cost type")