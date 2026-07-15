export function DeployModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center
            justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0
                  011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Deploy Your Site</h2>
          <p className="text-gray-500 text-sm mt-2">
            Deployment connects in Phase 6 when payments are ready.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <p className="text-blue-700 text-sm font-medium">Coming in Phase 6</p>
          <p className="text-blue-600 text-xs mt-1">
            Stripe payments, Vercel deployment integration, and real-time
            build status updates.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700
            font-semibold py-3 rounded-lg transition-colors"
        >
          Close
        </button>

      </div>
    </div>
  );
}