// Two modes:
// fullPage={true}  — covers the whole screen, used during route transitions
// fullPage={false} — inline spinner, used inside cards or sections

export default function Loader({ fullPage = false, size = 'md', label = '' }) {

  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`
        ${sizes[size] || sizes.md}
        border-blue-500 border-t-transparent
        rounded-full animate-spin
      `} />
      {/* Optional label shown below the spinner */}
      {label && (
        <p className="text-sm text-gray-500">{label}</p>
      )}
    </div>
  );

  // Full page version centres the spinner in the whole viewport
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-60 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Inline version — centres inside whatever container it sits in
  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}