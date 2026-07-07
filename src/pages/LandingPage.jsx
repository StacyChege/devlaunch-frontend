import { Link } from "react-router-dom";

export default function LandingPage() {
     return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Dev<span className="text-blue-500">Launch</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Welcome to your full-stack application workspace.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}