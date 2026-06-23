import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Handle the Loading State (Prevents the 'Flash' glitch)
    if (isLoading) {
        return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100">
        {/* Simple Tailwind Full-Page Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm font-medium text-slate-400">Verifying session...</p>
      </div>
    );
  }

  //  Guard against unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //  Handle Role-Based Protection (Admin vs. Standard User)
  if (requiredRole && user?.role !== requiredRole) {
    console.warn(`Access denied. User role "${user?.role}" does not match required role "${requiredRole}".`);
    return <Navigate to="/dashboard" replace />;
  }

  // If the user passes all security checks, render the actual page components
  return children;
}