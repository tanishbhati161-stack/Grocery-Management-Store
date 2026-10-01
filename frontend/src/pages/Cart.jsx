import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import designer1 from "../../image/designer1.png";
import { ShoppingCart, Search, LogOut } from "lucide-react";
function Cart() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item._id === id
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((currentCart) => {
      const updatedCart = currentCart
        .map((item) =>
          item._id === id
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  // Remove item
  const removeItem = (id) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.filter(
        (item) => item._id !== id
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Navbar */}
      <nav className="customer-navbar">

        <div className="customer-brand">
          <div className="customer-brand-icon">
            <Link to="/shop">
              <img
                src={designer1}
                alt="Grocery Management System"
                className="login-main-logo"
              />
            </Link>
          </div>

          <div>
            <h2>GroceryMart</h2>
            <span>Fresh & Quality Products</span>
          </div>
        </div>

        <div className="customer-nav-actions">
          <Link to="/shop" className="back-to-shop">
            <span>←</span> Continue Shopping
          </Link>

          <Link
            to="/my-orders"
            className="customer-orders-link"
            
          >
            My Orders
          </Link>

          <button
            onClick={handleLogout}
            className="customer-logout"
          >
            <LogOut size={30} />
            Logout
          </button>

        </div>

      </nav>
      <div className="cart-page">

        {/* Header */}
        <div className="cart-header">
          <div className="cart-heading">
            <div>
              <h1>Your Cart</h1>
              <p>Review your grocery items</p>
            </div>
          </div>


        </div>

        {cart.length === 0 ? (

          /* Empty Cart */
          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Add some grocery products to your cart.
            </p>

            <Link
              to="/shop"
              className="shop-now-button"
            >
              Shop Now
            </Link>

          </div>

        ) : (

          <div className="cart-container">

            {/* Cart Items */}
            <div className="cart-items">

              {cart.map((item) => (

                <div
                  className="cart-item"
                  key={item._id}
                >
                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>🛍️</span>
                    )}
                  </div>



                  <div className="cart-item-info">

                    <span>
                      {item.category}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹{item.price} / {item.unit}
                    </p>

                  </div>


                  {/* Quantity */}
                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* Item Price */}
                  <div className="cart-item-price">

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeItem(item._id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>


            {/* Order Summary */}
            <div className="order-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Items</span>
                <span>
                  {cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default Cart;