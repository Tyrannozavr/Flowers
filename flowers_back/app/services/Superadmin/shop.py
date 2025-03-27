from starlette_admin import *
from starlette_admin.contrib.sqla import ModelView
from app.models.shop import Shop, ShopType, ShopTypeAttribute

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
        IntegerField("id", label="ID", read_only=True),
        HasOne("shop_type", identity="ShopType".lower(), label="Shop Type", required=True),
        HasOne("attribute", identity="ProductAttribute".lower(), label="Attribute", required=True),
    ]

    list_display = ["id", "shop_type", "attribute"]
    sortable_fields = ["id"]
    default_sort = [("id", True)]
