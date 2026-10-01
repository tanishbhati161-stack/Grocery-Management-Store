import {
  Package,
  ShoppingCart,
  IndianRupee,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "248",
      change: "+12.5%",
      description: "from last month",
      icon: Package,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: "1,284",
      change: "+8.2%",
      description: "from last month",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: "₹84,520",
      change: "+15.8%",
      description: "from last month",
      icon: IndianRupee,
      trend: "up",
    },
    {
      title: "Customers",
      value: "1,842",
      change: "-2.4%",
      description: "from last month",
      icon: Users,
      trend: "down",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1001",
      customer: "Rahul Sharma",
      items: "4 items",
      amount: "₹650",
      status: "Delivered",
    },
    {
      id: "#ORD-1002",
      customer: "Priya Patel",
      items: "6 items",
      amount: "₹1,240",
      status: "Processing",
    },
    {
      id: "#ORD-1003",
      customer: "Amit Verma",
      items: "2 items",
      amount: "₹320",
      status: "Pending",
    },
    {
      id: "#ORD-1004",
      customer: "Neha Singh",
      items: "8 items",
      amount: "₹1,890",
      status: "Delivered",
    },
  ];

  const lowStockProducts = [
    {
      name: "Basmati Rice",
      category: "Grains",
      stock: 5,
    },
    {
      name: "Sugar",
      category: "Grocery",
      stock: 3,
    },
    {
      name: "Cooking Oil",
      category: "Oil & Ghee",
      stock: 4,
    },
    {
      name: "Wheat Flour",
      category: "Grains",
      stock: 7,
    },
  ];

  return (
    <div className="dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>Good morning, Admin 👋</h1>

          <p>
            Here's what's happening with your grocery store today.
          </p>
        </div>

        <button className="add-product-btn">
          + Add Product
        </button>

      </div>


      {/* Statistics */}

      <div className="stats-grid">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>

              <div className="stat-top">

                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <button className="more-btn">
                  <MoreHorizontal size={19} />
                </button>

              </div>

              <p className="stat-title">
                {stat.title}
              </p>

              <h2 className="stat-value">
                {stat.value}
              </h2>

              <div className="stat-change">

                {stat.trend === "up" ? (
                  <ArrowUpRight size={15} />
                ) : (
                  <ArrowDownRight size={15} />
                )}

                <span>
                  {stat.change}
                </span>

                <small>
                  {stat.description}
                </small>

              </div>

            </div>
          );
        })}

      </div>


      {/* Bottom section */}

      <div className="dashboard-grid">


        {/* Recent Orders */}

        <div className="dashboard-card orders-card">

          <div className="card-header">

            <div>
              <h3>Recent Orders</h3>
              <p>Latest customer orders</p>
            </div>

            <button className="view-all">
              View all
            </button>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {recentOrders.map((order) => (

                  <tr key={order.id}>

                    <td className="order-id">
                      {order.id}
                    </td>

                    <td>
                      {order.customer}
                    </td>

                    <td>
                      {order.items}
                    </td>

                    <td className="amount">
                      {order.amount}
                    </td>

                    <td>

                      <span
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* Low Stock */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>Low Stock Products</h3>
              <p>Products that need attention</p>
            </div>

            <button className="view-all">
              View all
            </button>

          </div>


          <div className="stock-list">

            {lowStockProducts.map((product) => (

              <div
                className="stock-item"
                key={product.name}
              >

                <div className="product-info">

                  <div className="product-placeholder">
                    {product.name.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category}
                    </span>
                  </div>

                </div>

                <div className="stock-count">

                  <strong>
                    {product.stock}
                  </strong>

                  <span>
                    left
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;