import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-blue-400 text-lg font-semibold mb-2">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}