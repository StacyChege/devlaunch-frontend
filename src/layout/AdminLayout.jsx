import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Developers' },
  { to: '/admin/templates', label: 'Templates' },
];

// A deliberately distinct shell from the developer dashboard — dark slate
// chrome, "Admin" wordmark, and a link back to the app.
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
      <NavLink
        to="/dashboard"
        className="block px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white mt-4"
      >
        ← Back to app
      </NavLink>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-slate-900 flex-col z-30">
        <div className="px-5 py-5 border-b border-slate-800">
          <span className="text-white font-bold tracking-tight">
            Dev<span className="text-indigo-400">Launch</span>
          </span>
          <span className="ml-2 text-[10px] uppercase tracking-wider bg-indigo-600 text-white px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>
        {nav}
        <div className="px-3 py-4 border-t border-slate-800">
          <p className="px-3 text-xs text-slate-400 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-red-900/40 hover:text-red-300"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col z-40 transform transition-transform lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-5 border-b border-slate-800 text-white font-bold">
          DevLaunch <span className="text-indigo-400">Admin</span>
        </div>
        {nav}
      </aside>

      <div className="flex-1 flex flex-col lg:ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-slate-500"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Platform Admin</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>

    </div>
  );
}
