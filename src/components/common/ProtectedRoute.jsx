import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ProtectedRoute({
  children,
}) {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/admin/login";
    return null;
  }

  return children;
}
