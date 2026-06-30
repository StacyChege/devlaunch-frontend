import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

// Authentic Page Component Imports
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import TemplatesPage from './pages/Templates/TemplatesPage'; // 💡 Double check spelling here: 'TemplatesPage' vs 'TemplatesPages'

// Simple Route Mock Stand-in Elements for Blueprint Navigation Map testing
const LandingMock = () => <div className="p-8 text-slate-800 font-semibold text-xl">Public Landing Page Website Home view portal</div>;
const DashboardMock = () => <div className="p-8 text-slate-800 font-semibold text-xl text-blue-600 font-bold">Main Dashboard Center Feed</div>;
const ProjectsListMock = () => <div className="p-8 text-slate-800 font-semibold text-xl">My App Projects list control dashboard views</div>;
const BillingPortalMock = () => <div className="p-8 text-slate-800 font-semibold text-xl">Subscription Pricing Tier Plans Payment Accounts billing configuration dashboard</div>;
const AccountSettingsMock = () => <div className="p-8 text-slate-800 font-semibold text-xl">User Security settings profile interface configuration parameters management views</div>;
const AdminGatewayConsoleMock = () => <div className="p-8 text-slate-800 font-semibold text-xl text-rose-600 font-bold">Admin Only Superuser Mainframe Command Center system control array</div>;

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
    <h1 className="text-5xl font-extrabold text-rose-500 mb-2 tracking-tight">404</h1>
    <p className="text-slate-400 font-medium mb-6">Object path index location target does not exist or was purged.</p>
    <a href="/dashboardlayout/dashboard" className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md">Bounce Back to Safety</a>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================================
            1. PUBLIC ACCESSIBLE GATEWAYS (NO AUTH TOKENS NEEDED)
            ========================================================= */}
        <Route path="/" element={<LandingMock />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Cleaned up: Removed the loose public templates path from here */}

        {/* =========================================================
            2. PROTECTED NESTED PORTAL ROUTE
            ========================================================= */}
        <Route 
          path="/dashboardlayout" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Relative child paths (NO leading slashes) */}
          <Route path="dashboard" element={<DashboardMock />} />
          
          {/* Connected perfectly inside the DashboardLayout frame ✅ */}
          <Route path="templates-dashboard" element={<TemplatesPage />} />
          
          <Route path="projects" element={<ProjectsListMock />} />
          <Route path="billing" element={<BillingPortalMock />} />
          <Route path="settings" element={<AccountSettingsMock />} />
        </Route>

        {/* =========================================================
            3. ADMINISTRATIVE PRIVILEGED USER TIER ROUTES
            ========================================================= */}
        <Route 
          path="/admin-layout" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin" element={<AdminGatewayConsoleMock />} />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}