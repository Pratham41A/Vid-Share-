import { Navigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";
import {Loader} from "../components/Loader.jsx";

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
     return <Loader />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}