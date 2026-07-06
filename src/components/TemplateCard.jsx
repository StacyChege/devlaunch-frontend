import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';

const CATEGORY_COLORS = {
  PORTFOLIO: 'bg-blue-100 text-blue-700',
  BUSINESS: 'bg-green-100 text-green-700',
  BLOG: 'bg-orange-100 text-orange-700',
  SAAS: 'bg-purple-100 text-purple-700',
  AGENCY: 'bg-pink-100 text-pink-700',
  ECOMMERCE: 'bg-yellow-100 text-yellow-700',
  DOCS: 'bg-gray-100 text-gray-700',
};

export default function TemplateCard({ template }) {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    
    // Core handler logic for creating a new project based on the selected template. It manages the loading state and error handling, ensuring a smooth user experience during the project creation process.
    const handleUseTemplate = async () => {
        setIsCreating(true);
        setError(null);
        try {
            const response = await createProject(template.id);
            // Navigate to the newly created project's page upon successful creation.
            navigate(`/projects/${response.data.id}`);
        } catch (err) {
          console.error(err);
          setError('Failed to create project. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

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

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          {template.preview_url && (
            <a
              href={template.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Preview
            </a>
          )}
          <button
            onClick={handleUseTemplate}
            disabled={isCreating}
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Use Template'
            )}
          </button>
        </div>
      </div>
      
      {/* Meta Properties Details Section */}
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
        
        {/* 'line-clamp-2' class limits the description to two lines */}
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

        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>

    </div>
  );
}