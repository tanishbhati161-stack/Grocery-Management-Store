from django.urls import path

from .views import orders, update_order_status


urlpatterns = [
    path(
        "",
        orders,
        name="orders"
    ),

    path(
        "<str:order_id>/status/",
        update_order_status,
        name="update-order-status"
    ),
]