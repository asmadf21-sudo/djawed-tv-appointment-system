import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated =
    localStorage.getItem("adminAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;