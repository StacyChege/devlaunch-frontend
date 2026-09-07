import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplates } from '../../api/templates';
import { createProject } from '../../api/projects';
import TemplateCard from '../../components/TemplateCard';
import SkeletonCard from '../../components/SkeletonCard';
import TemplatePreviewModal from '../../components/TemplatePreviewModal';
import useDebounce from '../../hooks/useDebounce';

const CATEGORY_PILLS = [
  { label: 'All', value: 'ALL' },
  { label: 'Portfolio', value: 'PORTFOLIO' },
  { label: 'Business', value: 'BUSINESS' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'SaaS', value: 'SAAS' },
  { label: 'Agency', value: 'AGENCY' },
  { label: 'E-Commerce', value: 'ECOMMERCE' },
  { label: 'Documentation', value: 'DOCS' },
];

const TECH_OPTIONS = [
  { label: 'Any tech stack', value: 'ALL' },
  { label: 'React', value: 'React' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'HTML/CSS', value: 'HTML/CSS' },
];

const PRICING_OPTIONS = [
  { label: 'Free & Premium', value: 'ALL' },
  { label: 'Free only', value: 'free' },
  { label: 'Premium only', value: 'premium' },
];

export default function TemplatesPage() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState('ALL');
  const [techStack, setTechStack] = useState('ALL');
  const [pricing, setPricing] = useState('ALL');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [creatingId, setCreatingId] = useState(null);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getTemplates({
          category,
          techStack,
          pricing,
          search: debouncedSearch,
        });
        if (!cancelled) setTemplates(res.data);
      } catch {
        if (!cancelled) setError('Failed to load templates. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [category, techStack, pricing, debouncedSearch]);

  const handleUseTemplate = useCallback(
    async (template) => {
      setCreatingId(template.id);
      setCreateError(null);
      try {
        const res = await createProject(template.id);
        navigate(`/projects/${res.data.id}`);
      } catch {
        setCreateError('Could not create a project from that template. Please try again.');
        setCreatingId(null);
      }
    },
    [navigate]
  );

  const clearFilters = () => {
    setCategory('ALL');
    setTechStack('ALL');
    setPricing('ALL');
    setSearchInput('');
  };

  const hasActiveFilters =
    category !== 'ALL' || techStack !== 'ALL' || pricing !== 'ALL' || searchInput !== '';

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Template Gallery</h1>
        <p className="text-gray-500 mt-1">Choose a template to start your project.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">

        <div className="flex flex-wrap gap-2">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setCategory(pill.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === pill.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TECH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRICING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search templates…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {createError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-red-600 text-sm">{createError}</p>
        </div>
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setCategory((c) => c)}
            className="text-red-600 underline text-sm mt-2"
          >
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg font-medium">No templates found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different filter or search term.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={setPreviewTemplate}
                onUse={handleUseTemplate}
                isCreating={creatingId === template.id}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">
            {templates.length} template{templates.length !== 1 ? 's' : ''} shown
          </p>
        </>
      )}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleUseTemplate}
          isCreating={creatingId === previewTemplate.id}
        />
      )}

    </div>
  );
}
