import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectStats } from '../../api/projects';

const STAT_CARDS = [
  {
    key: 'total_projects',
    label: 'Total Projects',
    color: 'bg-blue-50 text-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    key: 'deployed_sites',
    label: 'Deployed Sites',
    color: 'bg-green-50 text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    key: 'active_domains',
    label: 'Active Domains',
    color: 'bg-purple-50 text-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    key: 'total_paid',
    label: 'Total Paid',
    color: 'bg-orange-50 text-orange-600',
    prefix: 'KES ',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function StatusBadge({ status }) {
  const styles = {
    DEPLOYED: 'bg-green-100 text-green-700',
    DRAFT: 'bg-gray-100 text-gray-600',
    FAILED: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.DRAFT}`}>
      {status === 'DEPLOYED' ? 'Deployed' : status === 'FAILED' ? 'Failed' : 'Draft'}
    </span>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getProjectStats();
        setStats(response.data);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const hasProjects = stats?.total_projects > 0;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg flex-shrink-0 ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">
                {card.prefix || ''}{stats?.[card.key] ?? 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!hasProjects ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Pick a template from the gallery and your first project will appear here.
          </p>
          <Link
            to="/templates"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Project Name', 'Status', 'Last Updated', ''].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recent_projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">{project.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(project.updated_at).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/templates"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Project
        </Link>
        <Link
          to="/projects"
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          View All Projects
        </Link>
        <Link
          to="/billing"
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Manage Billing
        </Link>
      </div>

    </div>
  );
}