import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProject, updateProject, uploadProjectLogo } from '../../api/projects';
import { useProject } from '../context/ProjectContext';

export function ProjectEditorPage() {
  const { id } = useParams();
  const { setCurrentProjectName } = useProject();
  const iframeRef = useRef(null);

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    primaryColour: '#3B82F6',
    secondaryColour: '#1E3A5F',
    metaTitle: '',
    metaDescription: '',
    logoUrl: '',
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await getProject(id);
        const data = response.data;
        setProject(data);
        setCurrentProjectName(data.name);
        const custom = data.customisation_data || {};
        setForm({
          name: data.name || '',
          tagline: custom.tagline || '',
          primaryColour: custom.primary_colour || '#3B82F6',
          secondaryColour: custom.secondary_colour || '#1E3A5F',
          metaTitle: custom.meta_title || data.name || '',
          metaDescription: custom.meta_description || '',
          logoUrl: custom.logo_url || '',
        });
      } catch {
        setError('Failed to load project.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();

    return () => setCurrentProjectName(null);
  }, [id]);

  const handleFieldChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        customisation_data: {
          tagline: form.tagline,
          primary_colour: form.primaryColour,
          secondary_colour: form.secondaryColour,
          meta_title: form.metaTitle,
          meta_description: form.metaDescription,
          logo_url: form.logoUrl,
        },
      };
      const response = await updateProject(id, payload);
      setProject(response.data);
      setCurrentProjectName(response.data.name);

      if (iframeRef.current) {
        const src = iframeRef.current.src;
        iframeRef.current.src = '';
        setTimeout(() => {
          if (iframeRef.current) iframeRef.current.src = src;
        }, 100);
      }

      toast.success('Changes saved successfully');
    } catch {
      toast.error('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/png', 'image/svg+xml', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PNG, SVG, and JPG files are allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File must be under 2MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const response = await uploadProjectLogo(id, file);
      handleFieldChange('logoUrl', response.data.logo_url);
      toast.success('Logo uploaded');
    } catch {
      toast.error('Logo upload failed.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-500
          border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const previewUrl = project?.preview_url;

  return (
    <div className="flex gap-0 h-[calc(100vh-73px)] -m-6 overflow-hidden">

      {/* Customisation Panel */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200
        flex flex-col overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Customise</h2>
          <p className="text-xs text-gray-500 mt-0.5">Changes saved as drafts</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Site Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600
              uppercase tracking-wide mb-1.5">
              Site Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="My Portfolio"
              className="w-full border border-gray-200 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-gray-600
              uppercase tracking-wide mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => handleFieldChange('tagline', e.target.value)}
              placeholder="Building things that matter"
              className="w-full border border-gray-200 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Colours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600
                uppercase tracking-wide mb-1.5">
                Primary
              </label>
              <div className="flex items-center gap-2 border border-gray-200
                rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={form.primaryColour}
                  onChange={(e) =>
                    handleFieldChange('primaryColour', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0
                    p-0 bg-transparent"
                />
                <span className="text-xs text-gray-600 font-mono">
                  {form.primaryColour}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600
                uppercase tracking-wide mb-1.5">
                Secondary
              </label>
              <div className="flex items-center gap-2 border border-gray-200
                rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={form.secondaryColour}
                  onChange={(e) =>
                    handleFieldChange('secondaryColour', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0
                    p-0 bg-transparent"
                />
                <span className="text-xs text-gray-600 font-mono">
                  {form.secondaryColour}
                </span>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600
              uppercase tracking-wide mb-1.5">
              Logo
            </label>
            {form.logoUrl && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg border
                border-gray-100">
                <img
                  src={form.logoUrl}
                  alt="Logo preview"
                  className="h-10 object-contain"
                />
              </div>
            )}
            <label className={`flex items-center justify-center gap-2 w-full
              border-2 border-dashed rounded-lg px-3 py-3 text-sm cursor-pointer
              transition-colors ${isUploadingLogo
                ? 'border-blue-300 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-500'
              }`}>
              {isUploadingLogo ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500
                    border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0
                        0L8 8m4-4v12" />
                  </svg>
                  Upload PNG or SVG
                </>
              )}
              <input
                type="file"
                accept=".png,.svg,.jpg,.jpeg"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isUploadingLogo}
              />
            </label>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600
              uppercase tracking-wide mb-1.5">
              Meta Title
            </label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
              placeholder="Jane Doe — Developer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Shows in browser tab and search results
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600
              uppercase tracking-wide mb-1.5">
              Meta Description
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) =>
                handleFieldChange('metaDescription', e.target.value)}
              placeholder="Full-stack developer based in Nairobi..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.metaDescription.length}/160 characters
            </p>
          </div>

        </div>

        {/* Save Button */}
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60
              disabled:cursor-not-allowed text-white font-semibold py-2.5
              rounded-lg transition-colors flex items-center justify-center
              gap-2 text-sm"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white
                  border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-gray-200">

        <div className="flex items-center justify-between px-4 py-2
          bg-gray-800 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="font-mono truncate max-w-xs">
              {previewUrl || 'No preview URL yet'}
            </span>
          </div>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0
                    002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        <div className="flex-1 relative">
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Site preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center
              justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0
                    002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">
                No preview available yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Deploy your site to see a live preview
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}