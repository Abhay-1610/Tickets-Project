import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role ,hasCheckedAuth} = useSelector(
    (state) => state.auth
  );


  if (!hasCheckedAuth) {
    return null; // or a spinner if you want
  }

  // 🔐 Not logged in 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
