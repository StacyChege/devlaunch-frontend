import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { confirmPasswordReset } from '../../api/auth';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get('uid');
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const linkBroken = !uid || !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errors = {};
    if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (password !== confirm) errors.confirm = 'Passwords do not match.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setIsLoading(true);
    try {
      await confirmPasswordReset(uid, token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const data = error.response?.data;
      if (data?.new_password) {
        setFieldErrors({ password: [].concat(data.new_password)[0] });
      } else {
        setApiError(data?.error || 'This reset link is invalid or has expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        {linkBroken ? (
          <div className="text-center">
            <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 inline-flex mb-4">
              <AlertCircle className="h-8 w-8 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Broken reset link</h2>
            <p className="text-sm text-slate-400 mt-2">
              This link is missing information. Request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
            >
              Request a new link
            </Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 inline-flex mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Password updated</h2>
            <p className="text-sm text-slate-400 mt-2">Taking you to sign in…</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white text-center">Choose a new password</h2>

            {apiError && (
              <div className="mt-4 p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6" noValidate>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.password
                        ? 'border-rose-500/50 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="At least 8 characters"
                  />
                </div>
                {fieldErrors.password && <p className="mt-1 text-xs text-rose-400 font-medium">{fieldErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.confirm
                        ? 'border-rose-500/50 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="Re-enter your password"
                  />
                </div>
                {fieldErrors.confirm && <p className="mt-1 text-xs text-rose-400 font-medium">{fieldErrors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    Updating…
                  </>
                ) : (
                  'Update password'
                )}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
