// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Temporary Mock Components for Testing Visuals
const LoginMock = () => (
  <div className="p-8 bg-slate-800 text-white min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-4">Login Page</h1>
    <p className="text-slate-400">Public Gate — Anyone can see this.</p>
  </div>
);

const DashboardMock = () => (
  <div className="p-8 bg-slate-900 text-white min-h-screen">
    <h1 className="text-3xl font-bold text-emerald-400 mb-4">Secure User Dashboard</h1>
    <p className="text-slate-400">Private Gate — Only visible if logged in!</p>
  </div>
);

const AdminMock = () => (
  <div className="p-8 bg-slate-950 text-white min-h-screen">
    <h1 className="text-3xl font-bold text-rose-500 mb-4">Admin Control Center</h1>
    <p className="text-slate-400">Restricted Gate — Only visible to users with role: "admin".</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginMock />} />

        {/* Standard Protected Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardMock />
            </ProtectedRoute>
          } 
        />

        {/* Role-Protected Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminMock />
            </ProtectedRoute>
          } 
        />

        {/* Fallback Root Catch-All Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}