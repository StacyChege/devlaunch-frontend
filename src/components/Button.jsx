// Reusable button used across the whole app.
// Always use this instead of a raw <button> to keep styles consistent

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  // Base styles applied to every button regardless of variant or size
  const base = `
    inline-flex items-center justify-center gap-2 font-semibold
    rounded-lg transition-colors focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
  `;

  // Colour variants — add new ones here if the design grows
  const variants = {
    primary:   'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-300',
    danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost:     'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300',
  };

  // Size variants — controls padding and font size only
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${base}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Spinner replaces content while loading so the button width stays stable */}
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}