import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, roles }) => {
  if (!authUser) return <Navigate to="/login" />; 
  if (roles && !roles.includes(authUser.role)) return <Navigate to="/unauthorized" />; 
  return element; 
};

export default ProtectedRoute;
