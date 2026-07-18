// Shown when a list or page has no data yet.
// Pass an action button via the action prop to guide the user on what to do next

export default function EmptyState({
  title = 'Nothing here yet',
  description = '',
  action = null,
  icon = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

      {/* Icon area — uses a default folder icon if none is passed in */}
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
        {icon || (
          <svg
            className="w-10 h-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0
                00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      )}

      {/* Action is optional — pass a <Button> or <Link> component here */}
      {action && action}

    </div>
  );
}