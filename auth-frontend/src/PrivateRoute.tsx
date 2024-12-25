// PrivateRoute.tsx
import { useAuth } from "./authContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}
