import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, CheckCircle, Terminal } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  // const { register } = useAuth();

  // Access incoming background navigation memory payload (if any) to pre-fill the form fields
  const location = useLocation();

  // Extract pre-filled credentials safely 
  const incomingEmail = location.state?.prefilledEmail || '';
  const incomingPassword = location.state?.prefilledPassword || '';


  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(incomingEmail);
  const [password, setPassword] = useState(incomingPassword);
  const [confirmPassword, setConfirmPassword] = useState(incomingPassword);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successToast, setSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) errors.name = 'Full name is required.';

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setFieldErrors({});

    // Run local input checks
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // await register(fullName, email, password);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessToast(true);
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      navigate('/dashboardlayout/dashboard');
      
    } catch (error) {
      console.error('Registration processing error:', error);
      setApiError(error.response?.data?.detail || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl transition-all duration-300">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600/10 p-3 rounded-xl border border-blue-500/20 mb-3">
            <Terminal className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create an Account</h2>
          <p className="text-sm text-slate-400 mt-1">Join DevLaunch to scale your code deployments</p>
        </div>

        {successToast && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-start gap-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-200">Registration Successful!</p>
              <p className="text-xs text-emerald-400/90 mt-0.5">Check your email to verify your account. Redirecting shortly...</p>
            </div>
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                placeholder="Alex Carter"
              />
            </div>
            {fieldErrors.name && <p className="mt-1 text-xs text-rose-400 font-medium">{fieldErrors.name}</p>}
          </div>

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
                className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.email ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                placeholder="alex@example.com"
              />
            </div>
            {fieldErrors.email && <p className="mt-1 text-xs text-rose-400 font-medium">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.password ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {fieldErrors.password && <p className="mt-1 text-xs text-rose-400 font-medium">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-950 border text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.confirmPassword ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-rose-400 font-medium">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || successToast}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-all duration-150 shadow-md flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
