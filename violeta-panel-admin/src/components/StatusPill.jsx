import { getStatusBadge } from '../lib/utils'

export const StatusPill = ({ status }) => {
  const styles = {
    Activo:
      'bg-red-900/30 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(248,113,113,0.2)]',
    Atendido:
      'bg-emerald-900/30 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.2)]',
    Cerrado:
      'bg-purple-900/30 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(167,139,250,0.2)]',
    Archivado: 'bg-gray-800 text-gray-400 border-gray-600',
    default: 'bg-gray-800 text-gray-400 border-gray-600'
  }

  const info = getStatusBadge(status)
  const colorClass = styles[status] || styles.default

  return (
    <span
      className={`px-3 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-sm sm:text-xs font-bold border ${colorClass} flex items-center gap-1 w-fit animate-pulse`}
    >
      {/* El punto (dot) usa 'bg-current' así que tomará automáticamente el color del texto neón */}
      <span className='w-1.5 h-1.5 rounded-full bg-current opacity-80 shadow-sm' />
      {info?.label || status}
    </span>
  )
}
