import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");

  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  // User login nahi hai
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (role && user.role !== role) {

    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/shop" replace />;
  }

  return children;
}

export default ProtectedRoute;