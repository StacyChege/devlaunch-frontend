export default function PlaceholderPage({ title }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500">This page is coming in the next phase.</p>
    </div>
  );
}