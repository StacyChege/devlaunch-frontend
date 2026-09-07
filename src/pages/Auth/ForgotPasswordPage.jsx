import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '../../api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      // The API always responds 200 so we don't reveal which emails are registered.
      await requestPasswordReset(email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        {sent ? (
          <div className="text-center">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 inline-flex mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Check your email</h2>
            <p className="text-sm text-slate-400 mt-2">
              If an account exists for{' '}
              <span className="text-slate-200 font-medium">{email}</span>, a
              password reset link is on its way. It expires in 30 minutes.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white text-center">Reset your password</h2>
            <p className="text-sm text-slate-400 mt-1 text-center">
              Enter your account email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6" noValidate>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      error
                        ? 'border-rose-500/50 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="alex@example.com"
                  />
                </div>
                {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                Back to sign in
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
