import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  requireAuth = true,
  requireAdmin = false,
  children,
}: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If authentication is required and the user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required and the user is not an admin
  if (requireAdmin && profile?.type !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If the route requires no authentication but user is logged in (like /login)
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
