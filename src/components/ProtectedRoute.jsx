import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Wrap any route with this component to require login.
// Pass requiredRole="ADMIN" to also restrict by role
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show spinner while auth state is being checked on page load —
  // without this, logged-in users get briefly redirected to /login on refresh
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role — send to dashboard instead of showing an error
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}