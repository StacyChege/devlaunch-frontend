// Generic container card — used for dashboard sections, settings panels,
// and any content that needs a white box with a shadow

export default function Card({
  children,
  title = '',
  subtitle = '',
  padding = true,
  className = '',
}) {
  return (
    <div className={`
      bg-white rounded-xl border border-gray-100 shadow-sm
      overflow-hidden ${className}
    `}>

      {/* Header section only renders if a title is provided */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {/* padding prop lets full-bleed content like tables sit edge to edge */}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>

    </div>
  );
}