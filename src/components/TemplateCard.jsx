const CATEGORY_COLORS = {
  PORTFOLIO: 'bg-blue-100 text-blue-700',
  BUSINESS: 'bg-green-100 text-green-700',
  BLOG: 'bg-orange-100 text-orange-700',
  SAAS: 'bg-purple-100 text-purple-700',
  AGENCY: 'bg-pink-100 text-pink-700',
  ECOMMERCE: 'bg-yellow-100 text-yellow-700',
  DOCS: 'bg-gray-100 text-gray-700',
};

// Presentational card. Project creation + preview are owned by TemplatesPage
// so the same actions work from the preview modal.
export default function TemplateCard({ template, onPreview, onUse, isCreating }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">

      <div className="relative overflow-hidden bg-gray-100 aspect-video">
        {template.thumbnail_url ? (
          <img
            src={template.thumbnail_url}
            alt={`${template.name} preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPreview(template)}
            className="bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => onUse(template)}
            disabled={isCreating}
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating…
              </>
            ) : (
              'Use Template'
            )}
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-800 leading-tight">
            {template.name}
          </h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
            template.is_premium
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {template.is_premium ? 'Premium' : 'Free'}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
          {template.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            CATEGORY_COLORS[template.category] || 'bg-gray-100 text-gray-700'
          }`}>
            {template.category_display}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {template.tech_stack}
          </span>
        </div>
      </div>

    </div>
  );
}
