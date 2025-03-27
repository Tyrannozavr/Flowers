from starlette_admin import *
from starlette_admin.contrib.sqla import ModelView, Admin
from app.models.product import Product, ProductAttribute, ProductAttributeValue, ProductAvailabilityVariants, AVAILABILITY_LABELS
from app.core.database import engine  # Make sure to import your database engine

# Create an Admin instance
admin = Admin(engine, title="Your Admin Title")

class ProductAdmin(ModelView):
    model = Product
    identity = "Product".lower()
    label = "Product"
    name = "Product"
    icon = "fa fa-shopping-bag"

    fields = [
        IntegerField("id", label="ID", read_only=True),
        StringField("name", label="Product Name", required=True),
        TextAreaField("description", label="Description", required=False),
        TextAreaField("ingredients", label="Ingredients", required=True),
        IntegerField("price", label="Price (in cents)", required=True),
        ImageField("photo_url", label="Product Image", required=True),
        HasOne("category", identity="Category".lower(), label="Category", required=True),
        HasOne("shop", identity="Shop".lower(), label="Shop", required=True),
        EnumField(
            "availability",
            label="Availability",
            required=True,
            choices=[(v.value, AVAILABILITY_LABELS[v.value]) for v in ProductAvailabilityVariants],
        ),
        HasMany(
            "attribute_values",
            identity="ProductAttributeValue".lower(),
            label="Attributes",
            required=False
        )
    ]

    list_display = ["id", "name", "price", "category", "shop", "availability"]
    
    filters = [
        EnumField(
            "availability",
            label="Availability",
            choices=[(v.value, AVAILABILITY_LABELS[v.value]) for v in ProductAvailabilityVariants],
        ),
        StringField("name", label="Name contains"),
        HasOne("category", label="Category"),
        HasOne("shop", label="Shop"),
    ]

    search_fields = ["name", "description", "ingredients"]
    page_size = 25
    page_size_options = [10, 25, 50, 100]
    sortable_fields = ["id", "name", "price", "availability"]
    default_sort = [("id", True)]


    async def on_model_change(self, data, model, is_created):
        if data.get("price", 0) < 0:
            raise ValueError("Price cannot be negative")
        await super().on_model_change(data, model, is_created)

class ProductAttributeAdmin(ModelView):
    model = ProductAttribute
    identity = "ProductAttribute".lower()
    label = "Product Attribute"
    name = "Product Attribute"
    icon = "fa fa-tags"

    fields = [
        IntegerField("id", label="ID", read_only=True),
        StringField("name", label="Attribute Name", required=True),
        HasMany("attribute_values", identity="ProductAttributeValue".lower(), label="Attribute Values"),
        HasMany("shop_types", identity="ShopType".lower(), label="Shop Types"),
    ]

    list_display = ["id", "name"]
    
    filters = [
        StringField("name", label="Name contains"),
    ]

    search_fields = ["name"]
    page_size = 25
    page_size_options = [10, 25, 50, 100]
    sortable_fields = ["id", "name"]
    default_sort = [("id", True)]

class ProductAttributeValueAdmin(ModelView):
    model = ProductAttributeValue
    identity = "ProductAttributeValue".lower()
    label = "Product Attribute Value"
    name = "Product Attribute Value"
    icon = "fa fa-tag"

    fields = [
        IntegerField("id", label="ID", read_only=True),
        StringField("value", label="Attribute Value", required=True),
        HasOne("attribute", identity="ProductAttribute".lower(), label="Attribute", required=True),
        HasMany("products", identity="Product".lower(), label="Products"),
    ]

    list_display = ["id", "value", "attribute"]

    filters = [
        StringField("value", label="Value contains"),
        HasOne("attribute", label="Attribute"),
    ]

    search_fields = ["value"]
    page_size = 25
    page_size_options = [10, 25, 50, 100]
    sortable_fields = ["id", "value"]
    default_sort = [("id", True)]