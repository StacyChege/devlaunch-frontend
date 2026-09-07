import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const token = params.get('token');

  // verifying | success | error — seeded from whether a token is even present
  const [status, setStatus] = useState(token ? 'verifying' : 'error');
  const [message, setMessage] = useState(
    token ? '' : 'This link is missing its verification token.'
  );

  // StrictMode double-invokes effects in dev; guard so we only hit the API once
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 1200);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
            'This verification link is invalid or has expired.'
        );
      }
    })();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">

        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white">Verifying your email…</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 inline-flex mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Email verified</h2>
            <p className="text-sm text-slate-400 mt-2">
              Taking you to your dashboard…
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 inline-flex mb-4">
              <AlertCircle className="h-8 w-8 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Verification failed</h2>
            <p className="text-sm text-slate-400 mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
            >
              Back to sign in
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
