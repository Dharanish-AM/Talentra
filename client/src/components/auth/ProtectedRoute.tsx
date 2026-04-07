import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
