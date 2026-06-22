// src/App.jsx
import { useState } from 'react';
import { pingBackend } from './api/ping';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [backendData, setBackendData] = useState(null);
  const [error, setError] = useState(null);

  const handlePing = async () => {
    setLoading(true);
    setBackendData(null);
    setError(null);

    try {
      const data = await pingBackend();
      setBackendData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to communicate with backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-6 w-6 text-blue-400 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tight">DevLaunch Bridge Test</h1>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          Click the button below to fire a test request through your centralized Axios client to your local Django REST framework server.
        </p>

        <button
          onClick={handlePing}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? 'Pinging...' : 'Ping Django Backend'}
        </button>

        {/* Success Output */}
        {backendData && (
          <div className="mt-6 p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-emerald-300 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Connection Established!</p>
              <p className="text-xs text-emerald-400/80 mt-1">
                Response: <span className="font-mono bg-emerald-900/40 px-1 py-0.5 rounded">{JSON.stringify(backendData)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Failure/Error Output */}
        {error && (
          <div className="mt-6 p-4 bg-rose-950/50 border border-rose-500/30 rounded-lg text-rose-300 flex items-start gap-3">
            <XCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Bridge Failed</p>
              <p className="text-xs text-rose-400/80 mt-1">Error Details: {error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}