// Small status pill used in tables and cards to show things like
// project status, payment status, or role labels

export default function Badge({ label, variant = 'neutral', className = '' }) {

  // Each variant maps to a colour pair — background and text
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger:  'bg-red-100 text-red-700',
    info:    'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
    purple:  'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full
      text-xs font-medium ${variants[variant] || variants.neutral}
      ${className}
    `}>
      {label}
    </span>
  );
}