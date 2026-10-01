import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import LocationPicker from "../components/LocationPicker";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMapLocationSelect = async (location) => {
    setSelectedLocation(location);
    setAddressLoading(true);

    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        lat: String(location.lat),
        lon: String(location.lng),
        zoom: "18",
        addressdetails: "1",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Address lookup failed");
      }

      const data = await response.json();
      const address = data.address || {};

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.suburb ||
        "";

      const pincode = address.postcode || "";

      setFormData((previous) => ({
        ...previous,
        address: data.display_name || previous.address,
        city: city || previous.city,
        pincode: pincode || previous.pincode,
      }));
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      alert(
        "Address ya pincode auto-fetch nahi ho paya. Aap manually enter kar sakte hain."
      );
    } finally {
      setAddressLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const orderData = {
        customer: {
          ...formData,
          email: user?.email,
        },
        items: cart,
        total: total,
        delivery_location: selectedLocation
          ? {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          }
          : null,
      };


      console.log("Sending order:", orderData);

      const response = await createOrder(orderData);

      console.log("Order created:", response);

      alert("Order placed successfully!");

      // Clear cart after successful order
      localStorage.removeItem("cart");

      // Go to cart
      navigate("/cart");

    }
    catch (error) {
      console.error("ORDER ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);
      }

      alert(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to place order. Please try again."
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">

        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Please add products before checkout.
          </p>

          <Link
            to="/shop"
            className="shop-now-button"
          >
            Shop Now
          </Link>
        </div>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* Header */}

      <div className="checkout-header">

        <div>
          <h1>Checkout</h1>

          <p>
            Complete your order details
          </p>
        </div>

        <Link
          to="/cart"
          className="back-to-shop"
        >
          ← Back to Cart
        </Link>

      </div>


      <div className="checkout-container">

        {/* Customer Details */}

        <div className="checkout-form-card">

          <h2>Delivery Details</h2>

          <form onSubmit={handleSubmit}>

            <div className="checkout-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>


            <div className="checkout-field">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

            </div>


            <div className="checkout-field">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter delivery address"
                rows="4"
                required
              />

            </div>
            <div className="checkout-field">
              <label>
                Select Delivery Location on Map
              </label>

              <LocationPicker
                onLocationSelect={handleMapLocationSelect}
              />

              {selectedLocation && (
                <p>
                  Fetching address...
                </p>
              )}
            </div>
            <div className="checkout-row">

              <div className="checkout-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />

              </div>


              <div className="checkout-field">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              className="place-order-button"
            >
              Place Order
            </button>

          </form>

        </div>


        {/* Order Summary */}

        <div className="checkout-summary">

          <h2>Order Summary</h2>

          {cart.map((item) => (

            <div
              className="checkout-item"
              key={item._id}
            >

              <div>

                <strong>
                  {item.name}
                </strong>

                <p>
                  {item.quantity} × ₹{item.price}
                </p>

              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>

            </div>

          ))}


          <hr />

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{total}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;