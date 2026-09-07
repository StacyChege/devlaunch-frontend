import { useEffect } from 'react';

// Live template preview rendered in an iframe from the hosted demo (PRD F1).
export default function TemplatePreviewModal({ template, onClose, onUse, isCreating }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-800 truncate">
              {template.name}
            </h2>
            <p className="text-xs text-gray-400 truncate">
              {template.category_display} · {template.tech_stack}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {template.preview_url && (
              <a
                href={template.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200"
              >
                Open in new tab
              </a>
            )}
            <button
              onClick={() => onUse(template)}
              disabled={isCreating}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              {isCreating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                'Use this template'
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1"
              aria-label="Close preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-100">
          {template.preview_url ? (
            <iframe
              src={template.preview_url}
              title={`${template.name} preview`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
              No live preview available for this template.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
