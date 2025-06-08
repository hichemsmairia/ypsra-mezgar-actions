import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // If no user is logged in
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const { roles } = user;

  if (!allowedRoles.includes(roles[0])) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
