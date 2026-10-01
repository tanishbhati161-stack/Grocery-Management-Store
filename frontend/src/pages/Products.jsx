import { useState, useEffect } from "react";
import {
  getProducts, createProduct, updateProduct,
  deleteProduct,
} from "../services/api";
import {
  Search, Plus, MoreVertical, Edit,
  Trash2,
  PackageOpen,
  X,
} from "lucide-react";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [products, setProducts] = useState([]);
  /* {
     id: 1,
     name: "Basmati Rice",
     category: "Grains",
     price: 85,
     stock: 45,
     unit: "kg",
   },
   {
     id: 2,
     name: "Sugar",
     category: "Grocery",
     price: 48,
     stock: 32,
     unit: "kg",
   },
   {
     id: 3,
     name: "Cooking Oil",
     category: "Oil & Ghee",
     price: 135,
     stock: 18,
     unit: "L",
   },
   {
     id: 4,
     name: "Wheat Flour",
     category: "Grains",
     price: 52,
     stock: 7,
     unit: "kg",
   },
   {
     id: 5,
     name: "Toor Dal",
     category: "Pulses",
     price: 145,
     stock: 25,
     unit: "kg",
   },
   {
     id: 6,
     name: "Tea",
     category: "Beverages",
     price: 210,
     stock: 4,
     unit: "pack",
   },
   {
     id: 7,
     name: "Salt",
     category: "Grocery",
     price: 25,
     stock: 60,
     unit: "kg",
   },
   {
     id: 8,
     name: "Milk",
     category: "Dairy",
     price: 60,
     stock: 12,
     unit: "L",
   },
 ]); */

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const data = await getProducts();

        console.log("Products from MongoDB:", data);

        setProducts(data);

      } catch (error) {

        console.error(
          "Failed to fetch products:",
          error
        );

      }

    };

    fetchProducts();

  }, []);

  const categories = [
    "All",
    "Grains",
    "Grocery",
    "Oil & Ghee",
    "Pulses",
    "Beverages",
    "Dairy",
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Edit mode
  const [editingProduct, setEditingProduct] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    category: "Grocery",
    price: "",
    stock: "",
    unit: "kg",
    image: null,
  });

  // Search + category filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Open Add Product modal
  const openAddModal = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      category: "Grocery",
      price: "",
      stock: "",
      unit: "kg",
      image: null,
    });

    setShowModal(true);
  };

  // Open Edit Product modal
  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      image: null,
    });

    setShowModal(true);
  };

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Add or Update product
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      // =========================
      // UPDATE PRODUCT
      // =========================
      if (editingProduct) {
        const updatedProduct = {
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          unit: formData.unit,
          image: formData.image,
        };

        const response = await updateProduct(
          editingProduct._id,
          updatedProduct
        );

        console.log("Product updated:", response);

        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product._id === editingProduct._id
              ? response.product
              : product
          )
        );

        setShowModal(false);

        return;
      }

      // =========================
      // CREATE PRODUCT
      // =========================
      const newProduct = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        unit: formData.unit,
        image: formData.image,
      };

      const response = await createProduct(newProduct);

      console.log("Product created:", response);

      setProducts((previousProducts) => [
        ...previousProducts,
        response.product,
      ]);

      setShowModal(false);

      setFormData({
        name: "",
        category: "Grocery",
        price: "",
        stock: "",
        unit: "kg",
      });

    } catch (error) {
      console.error("Product operation failed:", error);

      alert("Something went wrong. Please try again.");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await deleteProduct(id);

      console.log("Product deleted:", response);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== id
        )
      );

    } catch (error) {
      console.error("Failed to delete product:", error);

      alert("Failed to delete product.");
    }
  };

  return (
    <div className="products-page">

      {/* Header */}

      <div className="products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage your grocery products and inventory.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>


      {/* Summary */}

      <div className="product-summary">

        <div className="summary-item">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div className="summary-item">
          <span>Low Stock</span>

          <strong className="low-stock-number">
            {
              products.filter(
                (product) => product.stock <= 10
              ).length
            }
          </strong>
        </div>

        <div className="summary-item">
          <span>Categories</span>
          <strong>{categories.length - 1}</strong>
        </div>

      </div>


      {/* Product Card */}

      <div className="products-card">

        {/* Toolbar */}

        <div className="products-toolbar">

          <div className="product-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>


          <div className="category-filter">

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
            >

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>

        </div>


        {/* Table */}

        {filteredProducts.length > 0 ? (

          <div className="products-table-wrapper">

            <table className="products-table">

              <thead>

                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredProducts.map((product) => (

                  <tr key={product._id}>

                    <td>

                      <div className="product-cell">

                        <div className="product-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            product.name.charAt(0)
                          )}
                        </div>

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            ID: #{product._id}
                          </span>
                        </div>

                      </div>

                    </td>

                    <td>
                      <span className="category-badge">
                        {product.category}
                      </span>
                    </td>

                    <td>
                      <strong>
                        ₹{product.price}
                      </strong>

                      <span className="unit">
                        /{product.unit}
                      </span>
                    </td>

                    <td>
                      {product.stock} {product.unit}
                    </td>

                    <td>

                      {product.stock <= 10 ? (

                        <span className="stock-status low">
                          Low Stock
                        </span>

                      ) : (

                        <span className="stock-status available">
                          In Stock
                        </span>

                      )}

                    </td>

                    <td>

                      <div className="product-actions">

                        <button
                          className="action-button edit"
                          title="Edit product"
                          onClick={() =>
                            openEditModal(product)
                          }
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="action-button delete"
                          title="Delete product"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                        <button
                          className="action-button more"
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="empty-products">

            <PackageOpen size={45} />

            <h3>No products found</h3>

            <p>
              Try changing your search or category filter.
            </p>

          </div>

        )}

      </div>


      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="product-modal">

            {/* Modal Header */}

            <div className="modal-header">

              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information."
                    : "Add a new product to your inventory."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>

            </div>


            {/* Form */}

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >

                    {categories
                      .filter(
                        (category) => category !== "All"
                      )
                      .map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Unit
                  </label>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="L">Liter (L)</option>
                    <option value="pack">Pack</option>
                    <option value="piece">Piece</option>
                  </select>

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    placeholder="Enter stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                  />

                </div>

              </div>
              <div className="form-group">
                <label>Product Image</label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(event) =>
                    setFormData((previousData) => ({
                      ...previousData,
                      image: event.target.files[0],
                    }))
                  }
                />
              </div>

              {/* Buttons */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;