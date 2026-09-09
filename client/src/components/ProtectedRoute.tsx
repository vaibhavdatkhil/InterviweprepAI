import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {

  const token = localStorage.getItem("token");

  if (!token || token === "demo-offline-jwt-token") {
    if (token === "demo-offline-jwt-token") {
      localStorage.removeItem("token");
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;