const variants = {
  primary:
    'bg-purple-600 text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500 hover:shadow-purple-900/60 border border-purple-500',
  secondary:
    'bg-gray-800 text-gray-200 border border-gray-600 hover:border-gray-500 hover:bg-gray-700',
  ghost: 'text-gray-400 hover:bg-gray-800 hover:text-white',
  danger:
    'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/40 border border-red-500',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 border border-emerald-500',
  warn: 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/40 border border-amber-500'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'

  return (
    <button
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
