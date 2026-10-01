from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime

from bson import ObjectId

from .mongodb import orders_collection


# ==========================================
# CREATE ORDER + GET ALL ORDERS
# ==========================================

@api_view(["POST", "GET"])
def orders(request):

    # ======================================
    # CREATE ORDER
    # ======================================

    if request.method == "POST":

        data = request.data

        customer = data.get("customer")
        items = data.get("items")
        total = data.get("total")
        delivery_location = data.get("delivery_location")
        # Validate customer details
        if not customer:
            return Response(
                {
                    "error": "Customer details are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate cart
        if not items:
            return Response(
                {
                    "error": "Order must contain at least one item."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate total
        if total is None:
            return Response(
                {
                    "error": "Order total is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order = {
            "customer": customer,
            "items": items,
            "total": total,
             "delivery_location": delivery_location,
            "status": "Pending",
            "created_at": datetime.utcnow(),
        }

        result = orders_collection.insert_one(order)

        return Response(
            {
                "message": "Order placed successfully.",
                "order": {
                    "id": str(result.inserted_id),
                    "customer": customer,
                    "items": items,
                    "total": total,
                    "delivery_location": delivery_location,
                    "status": "Pending",
                }
            },
            status=status.HTTP_201_CREATED
        )

    # ======================================
    # GET ALL ORDERS
    # ======================================

    if request.method == "GET":

        orders_list = []

        for order in orders_collection.find().sort(
            "created_at",
            -1
        ):

            orders_list.append(
                {
                    "id": str(order["_id"]),
                    "customer": order.get("customer"),
                    "items": order.get("items", []),
                    "total": order.get("total", 0),
                    "delivery_location": order.get("delivery_location"),
                    "status": order.get(
                        "status",
                        "Pending"
                    ),
                    "created_at": (
                        order.get(
                            "created_at"
                        ).isoformat()
                        if order.get("created_at")
                        else None
                    ),
                }
            )

        return Response(
            orders_list,
            status=status.HTTP_200_OK
        )


# ==========================================
# UPDATE ORDER STATUS
# ==========================================

@api_view(["PUT"])
def update_order_status(request, order_id):

    new_status = request.data.get("status")

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Delivered",
        "Cancelled",
    ]

    # Validate status
    if new_status not in allowed_statuses:

        return Response(
            {
                "error": "Invalid order status."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find and update order
    result = orders_collection.update_one(
        {
            "_id": ObjectId(order_id)
        },
        {
            "$set": {
                "status": new_status
            }
        }
    )

    # Order not found
    if result.matched_count == 0:

        return Response(
            {
                "error": "Order not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            "message": "Order status updated successfully.",
            "status": new_status
        },
        status=status.HTTP_200_OK
    )