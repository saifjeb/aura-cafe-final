import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children, adminOnly = false, roles = [] }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
