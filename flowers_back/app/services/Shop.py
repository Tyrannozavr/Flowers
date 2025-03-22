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


def calculate_delivery_cost(delivery_cost: ShopDeliveryCost, distance: int) -> float:
    if delivery_cost.type == DeliveryCostType.FIXED.value:
        return delivery_cost.fixed_cost
    elif delivery_cost.type == DeliveryCostType.RADIUS.value:
        for radius, cost in sorted(delivery_cost.radius_cost.items(), key=lambda x: float(x[0])):
            if distance <= float(radius):
                return cost
        return max(delivery_cost.radius_cost.values())
    elif delivery_cost.type == DeliveryCostType.YANDEX_GO.value:
        return 0
    else:
        raise ValueError("Invalid delivery cost type")