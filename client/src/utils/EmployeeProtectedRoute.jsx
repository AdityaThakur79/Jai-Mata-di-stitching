import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EmployeeProtectedRoute = ({ children }) => {
  const { isEmployeeAuthenticated } = useSelector((state) => state.auth);
  const employeeToken = localStorage.getItem("employeeToken");

  if (!isEmployeeAuthenticated && !employeeToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default EmployeeProtectedRoute; 