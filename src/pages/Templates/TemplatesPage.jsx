import { useState, useEffect, useMemo } from 'react';
import { getTemplates } from '../../api/templates';
import  TemplateCard from '../../components/TemplateCard';
import  SkeletonCard  from '../../components/SkeletonCard';
import  useDebounce from '../../hooks/useDebounce';

const FILTER_PILLS = [
  { label: 'All', value: 'ALL' },
  { label: 'Portfolio', value: 'PORTFOLIO' },
  { label: 'Business', value: 'BUSINESS' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'SaaS', value: 'SAAS' },
  { label: 'Agency', value: 'AGENCY' },
  { label: 'E-Commerce', value: 'ECOMMERCE' },
  { label: 'Documentation', value: 'DOCS' },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchInput, setSearchInput] = useState('');

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTemplates(activeCategory);
        setTemplates(response.data);
      } catch {
        setError('Failed to load templates. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [activeCategory]);

  const filteredTemplates = useMemo(() => {
    if (!debouncedSearch.trim()) return templates;
    const term = debouncedSearch.toLowerCase();
    return templates.filter((t) =>
      t.name.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  }, [templates, debouncedSearch]);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Template Gallery</h1>
        <p className="text-gray-500 mt-1">
          Choose a template to start your project.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">

        <div className="flex flex-wrap gap-2 flex-1">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => {
                setActiveCategory(pill.value);
                setSearchInput('');
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === pill.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 flex-shrink-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setActiveCategory(activeCategory)}
            className="text-red-600 underline text-sm mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg font-medium">No templates found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different category or search term.
          </p>
          <button
            onClick={() => { setActiveCategory('ALL'); setSearchInput(''); }}
            className="mt-4 text-blue-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <p className="text-xs text-gray-400 text-center">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} shown
        </p>
      )}

    </div>
  );
}