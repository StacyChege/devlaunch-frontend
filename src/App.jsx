import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import AdminLayout from './layout/AdminLayout';

// Authentic Page Component Imports
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder';
import NotFoundPage from './pages/NotFoundPage';
import TemplatesPage from './pages/Templates/TemplatesPage';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectEditorPage from './pages/ProjectEditor/ProjectEditorPage';
import AdminOverviewPage from './pages/Admin/AdminOverviewPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminTemplatesPage from './pages/Admin/AdminTemplatesPage';
import LandingPage from './pages/LandingPage';




function ProtectedLayout({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AdminProtected({ children }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />

        <Route
  path="/templates"
  element={
    <ProtectedLayout>
      <TemplatesPage />
    </ProtectedLayout>
  }
/>

        <Route
          path="/projects"
          element={
            <ProtectedLayout>
              <ProjectsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedLayout>
              <ProjectEditorPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/projects/:id/settings"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Project Settings" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Billing" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Settings" />
            </ProtectedLayout>
          }
        />

        <Route path="/admin" element={<AdminProtected><AdminOverviewPage /></AdminProtected>} />
        <Route path="/admin/users" element={<AdminProtected><AdminUsersPage /></AdminProtected>} />
        <Route path="/admin/templates" element={<AdminProtected><AdminTemplatesPage /></AdminProtected>} />

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}