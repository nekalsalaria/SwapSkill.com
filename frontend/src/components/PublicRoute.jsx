import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);
  const isLoaded = useSelector((state) => state.user.isLoaded);
  const location = useLocation();

  if (!isLoaded) return null;

  if (
    token &&
    (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
