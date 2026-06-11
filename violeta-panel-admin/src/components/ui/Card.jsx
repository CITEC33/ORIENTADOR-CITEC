export function Card({ className = '', children }) {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 shadow-xl shadow-black/20 rounded-2xl ${className}`}
    >
      {children}
    </div>
  )
}
