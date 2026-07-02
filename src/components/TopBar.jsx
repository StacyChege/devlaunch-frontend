import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/templates': 'Template Gallery',
  '/projects': 'My Projects',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/admin': 'Admin Panel',
};

export function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  const pageTitle = PAGE_TITLES[location.pathname] || 'DevLaunch';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative text-gray-500 hover:text-gray-700 transition-colors p-1"
          aria-label="Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.full_name}
          </span>
        </div>
      </div>

    </header>
  );
}