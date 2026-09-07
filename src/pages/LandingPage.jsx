import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTemplates } from '../api/templates';

const FEATURES = [
  {
    title: 'Start from a real template',
    body: 'Pick from a curated library of production-ready templates for portfolios, blogs, SaaS, agencies, docs and more.',
  },
  {
    title: 'Customise in the browser',
    body: 'Set your name, colours, logo and metadata from a structured panel — no local setup, no build tools.',
  },
  {
    title: 'Launch on your own domain',
    body: 'Deploy to a devlaunch.app subdomain, then connect a custom domain with automatic HTTPS.',
  },
];

export default function LandingPage() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getTemplates()
      .then((res) => !cancelled && setTemplates(res.data.slice(0, 6)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">
          Dev<span className="text-blue-500">Launch</span>
        </span>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-2">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Open-source website launchpad
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Go from template to live site in under an hour
        </h1>
        <p className="text-gray-400 text-lg mt-5">
          Choose a template, customise it in the browser, connect a domain, and
          deploy — all from one dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Create your account
          </Link>
          <a
            href="#templates"
            className="border border-gray-700 hover:border-gray-500 text-gray-200 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse templates
          </a>
        </div>
      </section>

      {/* Template preview */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Templates to start from</h2>
          <Link to="/register" className="text-sm text-blue-400 hover:text-blue-300">
            See all in the dashboard →
          </Link>
        </div>

        {templates.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-gray-900 border border-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((t) => (
              <div
                key={t.id}
                className="rounded-xl bg-gray-900 border border-gray-800 p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-100">{t.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    t.is_premium ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {t.is_premium ? 'Premium' : 'Free'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 flex-1">{t.description}</p>
                <div className="flex gap-2 mt-3 text-xs text-gray-500">
                  <span className="bg-gray-800 px-2 py-0.5 rounded-full">{t.category_display}</span>
                  <span className="bg-gray-800 px-2 py-0.5 rounded-full">{t.tech_stack}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="font-semibold text-lg text-gray-100">{f.title}</h3>
            <p className="text-sm text-gray-400 mt-2">{f.body}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to launch?</h2>
        <p className="text-gray-400 mt-3">
          Free to browse and build. Pay only when you deploy.
        </p>
        <Link
          to="/register"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        DevLaunch — open-source website launchpad
      </footer>

    </div>
  );
}
