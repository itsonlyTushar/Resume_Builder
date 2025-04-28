import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center mx-auto">
        <i className="fa-solid fa-spinner text-5xl "></i>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/signin" />;
}

export default ProtectedRoute;
