import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminUsers, setUserActive } from '../../api/admin';
import useDebounce from '../../hooks/useDebounce';

const ROLE_FILTERS = [
  { label: 'All roles', value: 'ALL' },
  { label: 'Developers', value: 'DEVELOPER' },
  { label: 'Admins', value: 'ADMIN' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAdminUsers({ search: debouncedSearch, role });
        if (!cancelled) setUsers(res.data);
      } catch {
        if (!cancelled) setError('Failed to load users.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, role, reloadKey]);

  const toggleActive = async (user) => {
    const next = !user.is_active;
    const verb = next ? 'Reactivate' : 'Suspend';
    if (!window.confirm(`${verb} ${user.email}?`)) return;
    setBusyId(user.id);
    try {
      const res = await setUserActive(user.id, next);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
      toast.success(`${verb}d ${user.email}`);
    } catch (err) {
      toast.error(err.response?.data?.error || `Could not ${verb.toLowerCase()} that user.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="text-red-600 underline text-sm mt-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['User', 'Role', 'Verified', 'Projects', 'Deployed', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-800">{u.full_name}</div>
                      <div className="text-slate-400 text-xs">{u.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">{u.is_verified ? 'Yes' : 'No'}</td>
                    <td className="px-5 py-3">{u.project_count}</td>
                    <td className="px-5 py-3">{u.deployed_count}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.role === 'ADMIN' ? (
                        <span className="text-xs text-slate-300">—</span>
                      ) : (
                        <button
                          onClick={() => toggleActive(u)}
                          disabled={busyId === u.id}
                          className={`text-xs font-semibold disabled:opacity-50 ${
                            u.is_active ? 'text-red-600 hover:underline' : 'text-green-600 hover:underline'
                          }`}
                        >
                          {busyId === u.id ? '…' : u.is_active ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                      No users match those filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
