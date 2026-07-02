import { useState} from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='min-h-screen bg-gray-100 flex'>
            <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)} 
            />

            {sidebarOpen && (
              <div 
              className='fixed inset-0 bg-black bg-opacity-50 z-40' 
              onClick={() => setSidebarOpen(false)} />
            )}
            <div className='flex-1 flex flex-col lg:ml-64'>
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className='flex-1 p-6'>
                    {children}
                </main>
            </div>
        </div>
    );
}