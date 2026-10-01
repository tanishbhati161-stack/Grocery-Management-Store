import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import re
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .mongodb import users_collection


# ==========================================
# REGISTER
# ==========================================

@api_view(["POST"])
def register(request):

    data = request.data

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
 # Required fields validation
    if not name or not email or not password:
        return Response(
            {
                "error": "Name, email and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove extra spaces
    name = name.strip()
    email = email.strip().lower()
    
    # Name validation
    if not re.match(r"^[A-Za-z ]+$", name):
        return Response(
        {
            "error": "Name can contain only letters and spaces"
        },
        status=status.HTTP_400_BAD_REQUEST
    )
    
    
    # Email validation
    if not re.match(r"^[^@\s]+@[^@\s]+\.com$", email):
        return Response(
            {
                "error": "Please enter a valid email with @ and .com"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    existing_user = users_collection.find_one(
            {"email": email}
        )
    

    if existing_user:
        return Response(
            {
                "error": "User with this email already exists"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    
    
    
    
    
    user = {
        "name": name,
        "email": email,
        "password": make_password(password),
        "role": "user",
    }

    result = users_collection.insert_one(user)

    return Response(
        {
            "message": "User registered successfully",

            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email,
                "role": "user",
            },
        },
        status=status.HTTP_201_CREATED
    )


# ==========================================
# LOGIN
# ==========================================

@api_view(["POST"])
def login_user(request):

    data = request.data

    email = data.get("email")
    password = data.get("password")

    # --------------------------------------
    # Validate input
    # --------------------------------------

    if not email or not password:
        return Response(
            {
                "error": "Email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # --------------------------------------
    # Find user in MongoDB
    # --------------------------------------

    user = users_collection.find_one(
        {"email": email}
    )

    if not user:
        return Response(
            {
                "error": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # --------------------------------------
    # Verify password
    # --------------------------------------

    password_is_correct = check_password(
        password,
        user.get("password")
    )

    if not password_is_correct:
        return Response(
            {
                "error": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # --------------------------------------
    # JWT payload
    # --------------------------------------

    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "user"),

        "exp": datetime.utcnow() + timedelta(hours=2)
    }

    # --------------------------------------
    # Generate JWT token
    # --------------------------------------

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256"
    )

    # --------------------------------------
    # Send response
    # --------------------------------------

    return Response(
        {
            "message": "Login successful",

            "token": token,

            "user": {
                "id": str(user["_id"]),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role", "user"),
            }
        },
        status=status.HTTP_200_OK
    )