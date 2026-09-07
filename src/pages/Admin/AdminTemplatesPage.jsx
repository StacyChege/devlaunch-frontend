import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAdminTemplates,
  createAdminTemplate,
  updateAdminTemplate,
  deleteAdminTemplate,
} from '../../api/admin';

const CATEGORIES = [
  ['PORTFOLIO', 'Portfolio'],
  ['BUSINESS', 'Business'],
  ['BLOG', 'Blog'],
  ['SAAS', 'SaaS'],
  ['AGENCY', 'Agency'],
  ['ECOMMERCE', 'E-Commerce'],
  ['DOCS', 'Documentation'],
];

const EMPTY = {
  name: '',
  description: '',
  category: 'PORTFOLIO',
  tech_stack: 'React',
  preview_url: '',
  source_path: '',
  is_premium: false,
  is_active: true,
};

function TemplateFormModal({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        tech_stack: form.tech_stack,
        preview_url: form.preview_url,
        source_path: form.source_path,
        is_premium: form.is_premium,
        is_active: form.is_active,
      };
      const res = isEdit
        ? await updateAdminTemplate(initial.id, payload)
        : await createAdminTemplate(payload);
      toast.success(isEdit ? 'Template updated' : 'Template created');
      onSaved(res.data);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(
          Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, [].concat(v)[0]])
          )
        );
      } else {
        toast.error('Could not save the template.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {isEdit ? 'Edit template' : 'New template'}
        </h2>
        <form onSubmit={submit} className="space-y-3">
          {[
            ['name', 'Name'],
            ['tech_stack', 'Tech stack'],
            ['preview_url', 'Preview URL'],
            ['source_path', 'Source path'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{label}</label>
              <input
                type="text"
                value={form[key] ?? ''}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_premium} onChange={(e) => set('is_premium', e.target.checked)} />
              Premium
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} />
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState(null); // template object or {} for new
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAdminTemplates();
        if (!cancelled) setTemplates(res.data);
      } catch {
        if (!cancelled) setError('Failed to load templates.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const upsert = (saved) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      return exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved];
    });
    setEditing(null);
  };

  const toggleActive = async (t) => {
    setBusyId(t.id);
    try {
      const res = await updateAdminTemplate(t.id, { is_active: !t.is_active });
      setTemplates((prev) => prev.map((x) => (x.id === t.id ? res.data : x)));
    } catch {
      toast.error('Could not update the template.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete "${t.name}"? Projects created from it keep their copy.`)) return;
    setBusyId(t.id);
    try {
      await deleteAdminTemplate(t.id);
      setTemplates((prev) => prev.filter((x) => x.id !== t.id));
      toast.success('Template deleted');
    } catch {
      toast.error('Could not delete the template.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{templates.length} templates in the library</p>
        <button
          onClick={() => setEditing({})}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + New template
        </button>
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
          <button onClick={() => setReloadKey((k) => k + 1)} className="text-red-600 underline text-sm mt-2">
            Try again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['Template', 'Category', 'Tech', 'Pricing', 'Projects', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-800">{t.name}</div>
                      <div className="text-slate-400 text-xs line-clamp-1 max-w-xs">{t.description}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{t.category_display}</td>
                    <td className="px-5 py-3 text-slate-600">{t.tech_stack}</td>
                    <td className="px-5 py-3">{t.is_premium ? 'Premium' : 'Free'}</td>
                    <td className="px-5 py-3">{t.project_count}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        t.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(t)}
                        disabled={busyId === t.id}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-50"
                      >
                        {t.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setEditing(t)}
                        className="text-xs font-semibold text-indigo-600 hover:underline ml-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(t)}
                        disabled={busyId === t.id}
                        className="text-xs font-semibold text-slate-400 hover:text-red-600 ml-3 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <TemplateFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={upsert}
        />
      )}
    </div>
  );
}
