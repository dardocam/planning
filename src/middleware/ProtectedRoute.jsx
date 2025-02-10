import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return <Navigate to="/planning" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
