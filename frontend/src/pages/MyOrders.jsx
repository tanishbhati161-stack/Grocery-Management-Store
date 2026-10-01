import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      // Current logged-in customer's email
      const myOrders = data.filter(
        (order) =>
          order.customer?.email === user?.email
      );

      setOrders(myOrders);

    } catch (error) {
      console.error("Failed to load my orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-empty">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div className="my-orders-page">

      <div className="my-orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track your grocery orders</p>
        </div>

        <Link
          to="/shop"
          className="back-to-shop"
        >
          ← Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (

        <div className="orders-empty">
          <h2>No orders yet</h2>

          <p>
            Your placed orders will appear here.
          </p>

          <Link
            to="/shop"
            className="shop-now-button"
          >
            Shop Now
          </Link>
        </div>

      ) : (

        <div className="my-orders-list">

          {orders.map((order) => (

            <div
              className="my-order-card"
              key={order.id}
            >

              <div className="my-order-header">

                <div>
                  <h3>
                    Order #{order.id.slice(-6)}
                  </h3>

                  <p>
                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>

                <span
                  className={`my-order-status ${order.status
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.status}
                </span>

              </div>


              <div className="my-order-items">

                {order.items.map((item) => (

                  <div
                    className="my-order-item"
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

              </div>


              <div className="my-order-footer">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{order.total}
                </strong>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyOrders;