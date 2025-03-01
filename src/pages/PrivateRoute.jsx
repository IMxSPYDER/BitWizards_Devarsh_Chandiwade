// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../Backend/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
