// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';


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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


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