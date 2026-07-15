import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { DeployModal } from '../components/DeployModal';

// Shell layout for all authenticated pages — handles the sidebar,
// topbar, and deploy modal in one place so pages stay focused on content
export function DashboardLayout({ children }) {
  // Controls the mobile sidebar drawer open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Controls the deploy modal — opened by the Deploy button in the Topbar
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Dark overlay behind the sidebar on mobile — clicking it closes the sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area — pushed right on desktop to make room for fixed sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onDeployClick={() => setDeployModalOpen(true)}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <DeployModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
      />

    </div>
  );
}