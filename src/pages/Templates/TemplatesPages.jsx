import { useState, useEffect, useMemo } from 'react';
import { Search, Layout, Layers } from 'lucide-react';

// Static Categories defined exactly as specified
const CATEGORIES = [
  'All', 
  'Portfolio', 
  'Business', 
  'Blog', 
  'SaaS', 
  'Agency', 
  'E-Commerce', 
  'Documentation'
];

// Mock Data matching the upcoming Django backend model blueprint
const MOCK_TEMPLATES = [
  { id: 1, name: 'SaaS Launchpad Pro', category: 'SaaS', description: 'Premium landing page with integrated analytics blocks and pricing tables.', pricing: 'Premium' },
  { id: 2, name: 'Minimalist Portfolio Slate', category: 'Portfolio', description: 'Clean, dark-mode focused grid design for designers and engineers.', pricing: 'Free' },
  { id: 3, name: 'Enterprise Corporate Hub', category: 'Business', description: 'Multi-page framework optimized for corporate consulting groups.', pricing: 'Premium' },
  { id: 4, name: 'DevDocs Markdown engine', category: 'Documentation', description: 'Side-navigation layout built explicitly for tech docs and wikis.', pricing: 'Free' },
  { id: 5, name: 'Creator Blog & CMS Engine', category: 'Blog', description: 'Lightweight static-site generation frame for modern writers.', pricing: 'Free' },
  { id: 6, name: 'Agile Marketing Suite', category: 'Agency', description: 'High-conversion design frames built for rapid client delivery.', pricing: 'Premium' }
];

// Inline Sub-component: TemplateCard
const TemplateCard = ({ template }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-blue-500/40 transition-all duration-200 group flex flex-col h-full">
    <div className="p-5 flex-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
          {template.category}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          template.pricing === 'Free' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950 text-amber-400 border border-amber-500/20'
        }`}>
          {template.pricing}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-150">
        {template.name}
      </h3>
      <p className="text-sm text-slate-400 mt-2 line-clamp-3">
        {template.description}
      </p>
    </div>
    <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex gap-2">
      <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors">
        Preview Layout
      </button>
      <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors">
        Use Template
      </button>
    </div>
  </div>
);

// Inline Sub-component: LoadingSkeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden p-5 flex flex-col h-64">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 w-20 bg-slate-800 rounded-md"></div>
      <div className="h-5 w-12 bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-6 bg-slate-800 rounded-md w-3/4 mb-3"></div>
    <div className="h-4 bg-slate-800 rounded-md w-full mb-2"></div>
    <div className="h-4 bg-slate-800 rounded-md w-5/6 mb-auto"></div>
    <div className="flex gap-2 pt-4 border-t border-slate-800/40">
      <div className="h-8 bg-slate-800 rounded-lg flex-1"></div>
      <div className="h-8 bg-slate-800 rounded-lg flex-1"></div>
    </div>
  </div>
);

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Step 1: Simulated GET /api/templates/ Fetch Cycle
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        // Simulating the backend response cycle delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setTemplates(MOCK_TEMPLATES);
      } catch (err) {
        console.error('Failed fetching template indexes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // Step 3: Debounce logic for client-side search field input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Combined Advanced Filtering Engine: Handles search and pills simultaneously
  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, debouncedSearchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Top Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Layers className="h-6 w-6 text-blue-500" />
          Blueprint Canvas Gallery
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Deploy structured configuration frames straight into your isolated cloud codebase workspace
        </p>
      </div>

      {/* Control Panel Block: Combines Filter Bar and Search Input */}
      <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Step 2: Horizontal Row of Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3.5 py-2 rounded-xl border whitespace-nowrap transition-all duration-150 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Step 3: Debounced Search Input Element */}
          <div className="relative min-w-[260px] md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search layout blueprints..."
              className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

        </div>
      </div>

      {/* Step 4: Responsive Layout Architecture Content Block */}
      {isLoading ? (
        // Grid matching Desktop: 3cols, Tablet: 2cols, Mobile: 1col
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <LoadingSkeleton key={i} />)}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        /* Empty Search Results UI Warning Frame */
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center bg-slate-900/10">
          <Layout className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No blueprint templates matched filter rules</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Try adjusting your structural text index string inputs or checking different categorization labels.
          </p>
        </div>
      )}
    </div>
  );
}