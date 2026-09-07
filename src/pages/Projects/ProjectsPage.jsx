import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProjects, deleteProject } from '../../api/projects';

const STATUS_STYLES = {
  DEPLOYED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  FAILED: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }) {
  const label =
    status === 'DEPLOYED' ? 'Deployed' : status === 'FAILED' ? 'Failed' : 'Draft';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES.DRAFT}`}>
      {label}
    </span>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  // Bumped by the "Try again" button to re-run the fetch effect.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getProjects();
        if (!cancelled) setProjects(res.data);
      } catch {
        if (!cancelled) setError('Failed to load your projects.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setDeletingId(project.id);
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast.success('Project deleted');
    } catch {
      toast.error('Could not delete that project.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <p className="text-gray-500 mt-1">Every site you&apos;ve started, in one place.</p>
        </div>
        <Link
          to="/templates"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={reload} className="text-red-600 underline text-sm mt-2">
            Try again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Pick a template from the gallery and your first project will show up here.
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Project', 'Template', 'Status', 'Last Updated', 'Live URL', ''].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-sm font-medium text-gray-800 hover:text-blue-600"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {project.template_name || '—'}
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
                    <td className="px-6 py-4 text-sm">
                      {project.live_url ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit
                        </a>
                      ) : (
                        <span className="text-gray-400">Not deployed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => handleDelete(project)}
                        disabled={deletingId === project.id}
                        className="text-sm text-gray-400 hover:text-red-600 font-medium ml-4 disabled:opacity-50"
                      >
                        {deletingId === project.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
