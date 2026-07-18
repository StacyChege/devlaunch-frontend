// Reusable text input with label, error message, and optional icon.
// Always use this instead of a raw <input> to keep form styles consistent

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  icon = null,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>

      {/* Label is optional — some inputs like search bars don't need one */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Icon sits inside the input on the left — only renders if passed in */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full border rounded-lg py-2.5 text-sm bg-white
            focus:outline-none focus:ring-2 transition-colors
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
            }
          `}
        />
      </div>

      {/* Error message appears below the input — only renders when there is an error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

    </div>
  );
}