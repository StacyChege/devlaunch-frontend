import { useEffect, useState } from 'react';
import { getAdminOverview } from '../../api/admin';

const CARDS = [
  { key: 'total_users', label: 'Total Users' },
  { key: 'developers', label: 'Developers' },
  { key: 'verified_users', label: 'Verified' },
  { key: 'suspended_users', label: 'Suspended' },
  { key: 'total_projects', label: 'Projects' },
  { key: 'deployed_projects', label: 'Deployed Sites' },
  { key: 'total_templates', label: 'Templates' },
  { key: 'active_templates', label: 'Active Templates' },
];

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAdminOverview()
      .then((res) => !cancelled && setData(res.data))
      .catch(() => !cancelled && setError('Failed to load platform stats.'));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <div key={card.key} className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {data ? data[card.key] : '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
