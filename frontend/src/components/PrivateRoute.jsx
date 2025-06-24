import { Navigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

import { toast } from "react-toastify";
import { useUserContext } from "../contexts/UserContext";

const PrivateRoute = ({ children }) => {
  const { userData, loading } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    if (!userData && !loading) {
      toast.error("Please login first");
    }
  }, [userData, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
