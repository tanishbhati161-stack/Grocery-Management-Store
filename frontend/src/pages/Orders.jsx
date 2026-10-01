import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      console.log("Orders from MongoDB:", data);

      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(
        orderId,
        newStatus
      );

      console.log("Order status updated:", response);

      await loadOrders();

    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders</p>
        </div>

        <div className="orders-count">
          {orders.length} Orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders found</h2>
          <p>Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => (
            <div className="order-card" key={order.id}>

              <div className="order-card-header">

                <div>
                  <h3>
                    Order #{order.id.slice(-6)}
                  </h3>

                  <p>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>
                <select
                  className={`order-status-select ${order.status
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Preparing">
                    Preparing
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

              </div>

              <div className="order-customer">

                <h4>Customer Details</h4>

                <p>
                  <strong>Name:</strong>{" "}
                  {order.customer?.name}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.customer?.phone}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.customer?.address},{" "}
                  {order.customer?.city} -{" "}
                  {order.customer?.pincode}
                </p>
                {order.delivery_location?.lat != null &&
                  order.delivery_location?.lng != null && (
                    <p>
                      <strong>Delivery Location:</strong>{" "}
                      <a
                        href={`https://www.google.com/maps?q=${order.delivery_location.lat},${order.delivery_location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Map
                      </a>
                    </p>
                  )}
              </div>

              <div className="order-items">

                <h4>Products</h4>

                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item._id}
                  >

                    <div>
                      <strong>{item.name}</strong>

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

              <div className="order-card-footer">

                <span>Total Amount</span>

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

export default Orders;