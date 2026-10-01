import { useState } from "react";
import { Link  , useNavigate  } from "react-router-dom";
import { ShoppingBasket, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/api";
import logo from "../../image/logo.jpg";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
 const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Check empty fields
  if (
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    alert("Please fill all fields.");
    return;
  }

  // Check password
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    console.log("Sending registration data:", userData);

    const response = await registerUser(userData);

    console.log("Registration successful:", response);

    alert("Account created successfully!");
    navigate("/login");

    // Clear form
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  } catch (error) {
    console.error("Registration failed:", error);

    const message =
      error.response?.data?.error ||
      "Registration failed. Please try again.";

    alert(message);
  }
};
  return (
    <div className="register-page">
          
  <div className="register-left">
      <div className="register-container">

        {/* Card */}
        <div className="register-card">

          <div className="register-header">
            <h2>Create Account</h2>
            <p>
              Create your account to manage groceries
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="register-form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="register-form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="register-form-group">
              <label htmlFor="password">Password</label>

              <div className="register-password-wrapper">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
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

            {/* Confirm Password */}
            <div className="register-form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-password-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="register-submit-button"
            >
              Create Account
            </button>

          </form>

          <div className="register-login-link">
            <span>Already have an account?</span>

            <Link to="/login">
              Login
            </Link>
          </div>

        </div>

        <p className="register-footer">
          © 2026 Grocery Management System
        </p>

      </div>
      </div>
           
              <div className="register-right">

      <img
        src={logo}
        alt="Grocery Management System"
        className="login-main-logo"
      />

    </div>
    </div>
  );
}

export default Register;