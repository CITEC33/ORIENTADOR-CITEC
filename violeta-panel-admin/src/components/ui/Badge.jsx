const tones = {
  neutral: 'bg-gray-700 text-gray-300 border border-gray-600',
  ok: 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30',
  warn: 'bg-amber-900/30 text-amber-400 border border-amber-500/30',
  danger: 'bg-red-900/30 text-red-400 border border-red-500/30',
  info: 'bg-blue-900/30 text-blue-400 border border-blue-500/30',
  violeta: 'bg-purple-900/30 text-purple-400 border border-purple-500/30',
  white: 'bg-white/10 text-white border border-white/10'
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${tones[tone] || tones.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
