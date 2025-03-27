from starlette_admin import *
from starlette_admin.contrib.sqla import ModelView
from app.models.shop import Shop, ShopType, ShopTypeAttribute
from app.models.product import ProductAttribute  # Make sure to import this

class ShopAdmin(ModelView):
    model = Shop
    identity = "Shop".lower()
    label = "Shop"
    name = "Shop"
    icon = "fa fa-store"

    fields = [
        IntegerField("id", label="ID", read_only=True),
        StringField("name", label="Shop Name", required=True),
        StringField("address", label="Address", required=True),
        StringField("phone", label="Phone", required=True),
        StringField("email", label="Email", required=True),
        HasMany("products", identity="Product".lower(), label="Products"),
    ]

    list_display = ["id", "name", "address", "phone", "email"]
    search_fields = ["name", "address", "phone", "email"]
    sortable_fields = ["id", "name"]
    default_sort = [("id", True)]

class ShopTypeAdmin(ModelView):
    model = ShopType
    identity = "ShopType".lower()
    label = "Shop Type"
    name = "Shop Type"
    icon = "fa fa-tags"

    fields = [
        IntegerField("id", label="ID", read_only=True),
        StringField("name", label="Type Name", required=True),
        HasMany("attributes", identity="ProductAttribute".lower(), label="Attributes"),
    ]

    list_display = ["id", "name"]
    search_fields = ["name"]
    sortable_fields = ["id", "name"]
    default_sort = [("id", True)]

class ShopTypeAttributeAdmin(ModelView):
    model = ShopTypeAttribute
    identity = "ShopTypeAttribute".lower()
    label = "Shop Type Attribute"
    name = "Shop Type Attribute"
    icon = "fa fa-link"

    fields = [
        HasOne("shop_type", identity="ShopType".lower(), label="Shop Type", required=True),
        HasOne("product_attribute", identity="ProductAttribute".lower(), label="Product Attribute", required=True),
    ]

    list_display = ["shop_type", "product_attribute"]
    sortable_fields = ["shop_type_id", "attribute_id"]
    default_sort = [("shop_type_id", True)]

    def get_list_query(self):
        return (
            super()
            .get_list_query()
            .join(ShopType, ShopTypeAttribute.shop_type_id == ShopType.id)
            .join(ProductAttribute, ShopTypeAttribute.attribute_id == ProductAttribute.id)
        )
