import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { updateProfile, changePassword } from '../../api/auth';

function ProfileCard() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dirty = fullName.trim() !== (user?.full_name || '');

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const res = await updateProfile(fullName.trim());
      updateUser(res.data);
      toast.success('Profile updated');
    } catch (err) {
      setError(err.response?.data?.full_name?.[0] || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Profile</h2>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
          <p className="text-sm text-gray-700 py-2">{user?.email}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account</label>
          <div className="flex items-center gap-2 py-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {user?.role}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              user?.is_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {user?.is_verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!dirty || saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function SecurityCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!current) errs.current = 'Enter your current password.';
    if (next.length < 8) errs.next = 'New password must be at least 8 characters.';
    if (next !== confirm) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await changePassword(current, next);
      toast.success('Password changed');
      setCurrent('');
      setNext('');
      setConfirm('');
      setErrors({});
    } catch (err) {
      const data = err.response?.data;
      setErrors({
        current: data?.current_password?.[0],
        next: data?.new_password?.[0],
      });
      if (!data?.current_password && !data?.new_password) {
        toast.error('Could not change your password.');
      }
    } finally {
      setSaving(false);
    }
  };

  const field = (label, value, setter, key, placeholder) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Password</h2>
      {field('Current password', current, setCurrent, 'current', 'Your current password')}
      {field('New password', next, setNext, 'next', 'At least 8 characters')}
      {field('Confirm new password', confirm, setConfirm, 'confirm', 'Re-enter new password')}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          {saving ? 'Updating…' : 'Change password'}
        </button>
      </div>
    </form>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account details and password.</p>
      </div>
      <ProfileCard />
      <SecurityCard />
    </div>
  );
}
