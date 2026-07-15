import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider must wrap everything so auth state is available globally */}
    <AuthProvider>
      {/* ProjectProvider shares the active project name with the Topbar */}
      <ProjectProvider>
        {/* Toaster must be rendered once here so toast() works anywhere in the app */}
        <Toaster position="top-right" />
        <App />
      </ProjectProvider>
    </AuthProvider>
  </React.StrictMode>,
);