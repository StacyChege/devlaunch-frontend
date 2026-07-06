// Mock loading skeleton card component for template previews. This component is used to indicate loading state while the actual template data is being fetched and rendered.

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-5 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );  
}