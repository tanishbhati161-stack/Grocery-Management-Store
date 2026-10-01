import React from 'react'

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/api";
import logo2 from "../../image/logo.jpg"
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      console.log("Sending login data:", formData);

      const response = await loginUser(formData);

      console.log("Login successful:", response);

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );
      alert("Login successful!");

      if (response.user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/shop");
      }


    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.error ||
        "Login failed. Please try again.";

      alert(message);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">

        <img
          src={logo2}
          alt="Grocery Management System"
          className="login-main-logo"
        />

      </div>
      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-container">

          {/* Login Card */}
          <div className="login-card">

            <div className="login-header">
              <h2>Welcome Back</h2>

              <p>
                Login to manage your grocery store
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="login-form-group">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="login-form-group">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="login-password-wrapper">

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-submit-button"
              >
                Login
              </button>

            </form>

            {/* Register */}
            <div className="login-register-link">
              <span>Don't have an account?</span>

              <Link to="/register">
                Create Account
              </Link>
            </div>

          </div>

          <p className="login-footer">
            © 2026 Grocery Management System
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;