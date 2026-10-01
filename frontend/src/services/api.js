import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getProducts = async () => {
  const response = await API.get("/products/");
  return response.data;
};

export const createProduct = async (product) => {
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("category", product.category);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("unit", product.unit);

  if (product.image) {
    formData.append("image", product.image);
  }

  const response = await API.post("/products/", formData);

  return response.data;
};

export const updateProduct = async (id, product) => {
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("category", product.category);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("unit", product.unit);

  if (product.image) {
    formData.append("image", product.image);
  }

  const response = await API.put(
    `/products/${id}/`,
    formData
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}/`);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register/", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post(
    "/auth/login/",
    userData
  );

  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await API.post("/orders/", orderData);

  return response.data;
};

export const getOrders = async () => {
  const response = await API.get("/orders/");
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await API.put(
    `/orders/${id}/status/`,
    {
      status: status,
    }
  );

  return response.data;
};

