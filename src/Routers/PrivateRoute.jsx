import React, { useContext } from "react";
import { AuthContext } from "../Poveiders/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  // console.log(user);

  // redirect user to dashboard if loggedin
  if (loading) {
    return (
      <div className="px-10 py-10 flex flex-col justify-center items-center gap-4 lg:h-screen">
        <span className="loading loading-bars loading-md"></span>
      </div>
    );
  }
  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
