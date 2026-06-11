export function Input({ className = '', error = false, ...props }) {
  const errorClasses = error
    ? 'border-red-500 focus:border-red-400 focus:ring-red-900/40'
    : 'border-gray-600 focus:border-purple-500 focus:ring-purple-900/40'

  return (
    <input
      className={`w-full rounded-xl border bg-gray-900 px-4 py-3 text-sm text-gray-200 outline-none transition focus:ring-4 placeholder-gray-500 ${errorClasses} ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = '', error = false, ...props }) {
  const errorClasses = error
    ? 'border-red-500 focus:border-red-400 focus:ring-red-900/40'
    : 'border-gray-600 focus:border-purple-500 focus:ring-purple-900/40'

  return (
    <textarea
      className={`w-full rounded-xl border bg-gray-900 px-4 py-3 text-sm text-gray-200 outline-none transition focus:ring-4 resize-none placeholder-gray-500 ${errorClasses} ${className}`}
      {...props}
    />
  )
}
