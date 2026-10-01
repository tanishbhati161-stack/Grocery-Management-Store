from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from bson import ObjectId
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .mongodb import products_collection
from django.conf import settings

@api_view(["GET", "POST"])
@parser_classes([MultiPartParser, FormParser])
def product_list(request):

    # =========================
    # GET → Fetch all products
    # =========================

    if request.method == "GET":

        products = list(products_collection.find())

        for product in products:
            product["_id"] = str(product["_id"])
            if product.get("image"):
               product["image"] = request.build_absolute_uri(
                  settings.MEDIA_URL + product["image"]
            )
        return Response(products)


    # =========================
    # POST → Create product
    # =========================

    if request.method == "POST":

        data = request.data

        required_fields = [
            "name",
            "category",
            "price",
            "stock",
            "unit",
        ]

        # Validation
        for field in required_fields:

            if field not in data or data[field] in ["", None]:

                return Response(
                    {
                        "error": f"{field} is required"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )


        product = {
            "name": data["name"],
            "category": data["category"],
            "price": data["price"],
            "stock": data["stock"],
            "unit": data["unit"],
        }
        # =========================
        # IMAGE UPLOAD
        # =========================

        image = request.FILES.get("image")

        if image:
           file_path = default_storage.save(
               f"products/{image.name}",
               ContentFile(image.read())
    )

           product["image"] = file_path

        else:
            product["image"] = None


        result = products_collection.insert_one(product)

        product["_id"] = str(result.inserted_id)
        # Response ke liye image ka full URL banao
        if product.get("image"):
            product["image"] = request.build_absolute_uri(
               settings.MEDIA_URL + product["image"]
    )

        return Response(
            {
                "message": "Product created successfully",
                "product": product,
            },
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# UPDATE / DELETE SINGLE PRODUCT
# ============================================================

@api_view(["PUT", "DELETE"])
@parser_classes([MultiPartParser, FormParser])
def product_detail(request, product_id):

    # Check valid MongoDB ObjectId
    try:

        object_id = ObjectId(product_id)

    except Exception:

        return Response(
            {
                "error": "Invalid product ID"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


    # =========================
    # PUT → Update product
    # =========================

    if request.method == "PUT":

        data = request.data

        update_data = {
            "name": data.get("name"),
            "category": data.get("category"),
            "price": data.get("price"),
            "stock": data.get("stock"),
            "unit": data.get("unit"),
        }


        # Remove empty values
        update_data = {
            key: value
            for key, value in update_data.items()
            if value not in ["", None]
        }


        if not update_data:

            return Response(
                {
                    "error": "No data provided for update"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        result = products_collection.update_one(
            {"_id": object_id},
            {"$set": update_data},
        )


        if result.matched_count == 0:

            return Response(
                {
                    "error": "Product not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        updated_product = products_collection.find_one(
            {"_id": object_id}
        )

        updated_product["_id"] = str(
            updated_product["_id"]
        )


        return Response(
            {
                "message": "Product updated successfully",
                "product": updated_product,
            },
            status=status.HTTP_200_OK,
        )


    # =========================
    # DELETE → Delete product
    # =========================

    if request.method == "DELETE":

        result = products_collection.delete_one(
            {"_id": object_id}
        )


        if result.deleted_count == 0:

            return Response(
                {
                    "error": "Product not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        return Response(
            {
                "message": "Product deleted successfully"
            },
            status=status.HTTP_200_OK,
        )