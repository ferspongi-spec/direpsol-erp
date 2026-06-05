import {
  Navigate,
} from "react-router-dom";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {

  const seller =
    JSON.parse(
      localStorage.getItem("seller")
    );

  const user =
    localStorage.getItem("user");

  // no logueado
  if (!seller && !user) {

    return <Navigate to="/" />;

  }

  // solo admin
  if (
    adminOnly &&
    seller?.role !== "admin"
  ) {

    return <Navigate to="/sales" />;

  }

  return children;
}

export default ProtectedRoute;