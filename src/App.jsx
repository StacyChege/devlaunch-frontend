import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';

// Authentic Page Component Imports
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder';
import NotFoundPage from './pages/NotFoundPage';
import TemplatesPage  from './pages/Templates/TemplatesPage';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
              <PlaceholderPage title="My Projects" />
            </ProtectedLayout>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedLayout>
              <PlaceholderPage title="Project Editor" />
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

        <Route
          path="/admin"
          element={
            <ProtectedLayout requiredRole="ADMIN">
              <PlaceholderPage title="Admin Panel" />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}