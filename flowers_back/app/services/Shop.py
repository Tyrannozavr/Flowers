from app.dependencies.Shops import DeliveryCostType, ShopDeliveryCostCreate
from app.models.shop import ShopDeliveryCost

def create_shop_delivery_cost(delivery_cost: ShopDeliveryCostCreate):
    # Validate that only one option is provided
    options_count = sum([
        1 if delivery_cost.fixed_cost is not None else 0,
        1 if delivery_cost.radius_cost and any(delivery_cost.radius_cost.values()) else 0,
        1 if delivery_cost.is_yandex_geo else 0
    ])
    
    if options_count != 1:
        raise ValueError("Only one of fixed_cost, radius_cost, or is_yandex_geo must be provided")
    
    # Create the delivery cost object based on the type
    if delivery_cost.type == DeliveryCostType.FIXED.value:
        if delivery_cost.fixed_cost is None:
            raise ValueError("Fixed cost is required for fixed delivery cost type")
        return ShopDeliveryCost(
            type=str(delivery_cost.type),
            fixed_cost=delivery_cost.fixed_cost,
            radius_cost=None,
            is_yandex_geo=False
        )
    elif delivery_cost.type == DeliveryCostType.RADIUS.value:
        if not delivery_cost.radius_cost:
            raise ValueError("Radius cost is required for radius delivery cost type")
        return ShopDeliveryCost(
            type=str(delivery_cost.type),
            fixed_cost=None,
            radius_cost=delivery_cost.radius_cost,
            is_yandex_geo=False
        )
    elif delivery_cost.type == DeliveryCostType.YANDEX_GO.value:
        if not delivery_cost.is_yandex_geo:
            raise ValueError("is_yandex_geo must be True for Yandex Go delivery cost type")
        return ShopDeliveryCost(
            type=delivery_cost.type,
            fixed_cost=None,
            radius_cost=None,
            is_yandex_geo=True
        )
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