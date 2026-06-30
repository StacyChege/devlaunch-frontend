// src/components/Layout/DashboardLayout.jsx
import { useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  Terminal, LayoutDashboard, FileCode, FolderGit2, 
  CreditCard, Settings, ShieldCheck, LogOut, Menu, X, Bell, User 
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // State control for mobile hamburger slide-out menu drawer
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Structural mapping dictionary array updated with the true router prefix keys:
  const navigationLinks = [
    { name: 'Dashboard', path: '/dashboardlayout/dashboard', icon: LayoutDashboard, adminOnly: false },
    { name: 'Templates', path: '/dashboardlayout/templates-dashboard', icon: FileCode, adminOnly: false },
    { name: 'My Projects', path: '/dashboardlayout/projects', icon: FolderGit2, adminOnly: false },
    { name: 'Billing', path: '/dashboardlayout/billing', icon: CreditCard, adminOnly: false },
    { name: 'Settings', path: '/dashboardlayout/settings', icon: Settings, adminOnly: false },
    { name: 'Admin Command', path: '/admin-layout/admin', icon: ShieldCheck, adminOnly: true },
  ];

  // Dynamically extract and compute the current header title depending on matching route path location strings
  const getCurrentPageTitle = () => {
    const currentLink = navigationLinks.find(link => location.pathname === link.path);
    return currentLink ? currentLink.name : 'Console';
  };

  // Reusable layout link template block generator
  const renderNavLinks = () => {
    return navigationLinks.map((link) => {
      // Step 2 Guard: Don't show admin links to non-admin accounts
      if (link.adminOnly && user?.role !== 'admin') return null;

      const IconComponent = link.icon;

      return (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={() => setIsMobileOpen(false)} // Snap shut on mobile clicks
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`
          }
        >
          <IconComponent className="h-4 w-4" />
          <span>{link.name}</span>
        </NavLink>
      );
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 mb-4"></div>
        <p className="text-sm font-medium tracking-wide">Initializing secure workspace console...</p>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      
      {/* =========================================================
          STEP 2 & 4: SIDEBAR COMPONENT CONTAINER (DESKTOP & MOBILE FIXED DRAWER)
          ========================================================= */}
      {/* Background Mask Cover Overlays for dimming active background panels during mobile sidebar expansion states */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Branding Logo Header Header Box Block */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <Terminal className="h-5 w-5 text-blue-500" />
            </div>
            <span className="font-bold text-white tracking-wide">DevLaunch</span>
          </div>
          {/* Mobile Collapse Control Interface button trigger */}
          <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Secondary Middle Link List Track matrix arrays */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {renderNavLinks()}
        </nav>

        {/* Profile Anchor Identity Metadata Drawer Footnotes Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Developer account'}</p>
              <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'member'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          STEP 3: MAIN PANEL VIEW CONTENT TRACK WRAPPER (TOPBAR + INNER PAGES CONTENT CONTAINER)
          ========================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Horizontal Top Header Bar Line Panel Structure Wrapper */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          
          {/* Top Bar Left Margin: Mobile Toggle Button + Title Panel Text Metrics */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight transition-all">
              {getCurrentPageTitle()}
            </h1>
          </div>

          {/* Top Bar Right Margin: Actions Control Blocks + Avatars Notification Icons Widgets */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-200 cursor-pointer shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
            </div>
          </div>
        </header>

        {/* MAIN NESTED APP LAYOUT BODY CONTENT OUTLET TARGET PORT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-50 max-w-7xl w-full mx-auto">
          <Outlet /> 
        </main>
      </div>

    </div>
  );
}