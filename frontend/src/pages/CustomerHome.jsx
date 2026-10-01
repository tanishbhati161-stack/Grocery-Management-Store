import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, LogOut } from "lucide-react";
import { getProducts } from "../services/api";
import designer1 from "../../image/designer1.png";
import logo_2 from "../../image/logo_2.jpg"
import { useNavigate } from "react-router-dom";
function CustomerHome() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      console.log("Customer products:", data);

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    console.log("ADD TO CART CLICKED:", product);

    setCart((currentCart) => {
      console.log("CURRENT CART:", currentCart);

      const existingItem = currentCart.find(
        (item) => item._id === product._id
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = currentCart.map((item) =>
          item._id === product._id
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      console.log("UPDATED CART:", updatedCart);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="customer-page">

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

          <Link to="/cart" className="cart-link">
            <ShoppingCart size={30} />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
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


      {/* Hero */}
      <section className="customer-hero">

        <div>
          <p className="customer-hero-small">
            WELCOME TO GROCERYMART
          </p>

          <h1>
            Fresh groceries,
            <br />
            delivered to you.
          </h1>

          <p>
            Browse our collection of quality grocery products
            and add your favourites to your cart.
          </p>
        </div>
        <div className="customer-hero-image">
          <img
            src={designer1}
            alt="Grocery shopping"
            className="customer-hero-logo"
          />
        </div>
      </section>


      {/* Products Section */}
      <section className="customer-products-section">

        <div className="customer-products-header">

          <div>
            <h2>Shop Products</h2>
            <p>
              Choose from our collection of grocery products
            </p>
          </div>

          <div className="customer-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>


        {/* Products */}
        {loading ? (

          <div className="customer-message">
            Loading products...
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="customer-message">
            No products found.
          </div>

        ) : (

          <div className="customer-product-grid">

            {filteredProducts.map((product) => (

              <div
                className="customer-product-card"
                key={product._id}
              >

                <div className="customer-product-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="customer-product-photo"
                    />
                  ) : (
                    <span>🛍️</span>
                  )}
                </div>

                <div className="customer-product-info">

                  <span className="customer-product-category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="customer-product-unit">
                    ₹{product.price} / {product.unit}
                  </p>

                  <p className="customer-product-stock">
                    {product.stock > 0
                      ? `${product.stock} ${product.unit} available`
                      : "Out of stock"}
                  </p>

                  <button
                    type="button"
                    className="customer-add-cart"
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default CustomerHome;