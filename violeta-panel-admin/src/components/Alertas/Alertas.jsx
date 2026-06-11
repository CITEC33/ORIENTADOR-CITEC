import dayjs from 'dayjs'
import {
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  Info,
  AlertOctagon,
  Bell
} from 'lucide-react'

const priorityConfig = {
  Alta: {
    containerClass:
      'bg-gray-800 border-l-4 border-l-red-500 border-t border-r border-b border-gray-700 hover:border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]',
    color: 'bg-red-900/30 text-red-400 border border-red-500/30',
    icon: AlertOctagon,
    badge:
      'bg-red-900/50 text-red-300 border border-red-500/30 shadow-red-900/20'
  },
  Media: {
    containerClass:
      'bg-gray-800 border-l-4 border-l-orange-500 border-t border-r border-b border-gray-700 hover:border-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.1)]',
    color: 'bg-orange-900/30 text-orange-400 border border-orange-500/30',
    icon: AlertTriangle,
    badge:
      'bg-orange-900/50 text-orange-300 border border-orange-500/30 shadow-orange-900/20'
  },
  Baja: {
    containerClass:
      'bg-gray-800 border-l-4 border-l-purple-500 border-t border-r border-b border-gray-700 hover:border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.1)]',
    color: 'bg-purple-900/30 text-purple-400 border border-purple-500/30',
    icon: Info,
    badge:
      'bg-purple-900/50 text-purple-300 border border-purple-500/30 shadow-purple-900/20'
  }
}

export const Alertas = ({ filtered, onEdit, onDelete }) => {
  return filtered.length === 0 ? (
    <div className='text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-700'>
      <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700'>
        <Bell className='w-8 h-8 text-gray-600' />
      </div>
      <h3 className='text-white font-bold text-lg'>No hay alertas activas</h3>
      <p className='text-gray-500 text-sm mt-1'>
        Crea una nueva alerta para notificar a los usuarios.
      </p>
    </div>
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {filtered.map((item) => {
        const isExpired =
          item.fecha_expiracion && new Date(item.fecha_expiracion) < new Date()

        const style = priorityConfig[item.prioridad] || priorityConfig['Media']
        const Icon = style.icon

        return (
          <div
            key={item.id}
            className={`group relative rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${style.containerClass} `}
          >
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className={`p-2.5 rounded-xl ${style.color}`}>
                  <Icon className='w-5 h-5' />
                </div>
                <span
                  className={`text-[10px] uppercase font-black px-2 py-1 rounded-md border ${style.badge}`}
                >
                  {item.prioridad}
                </span>
              </div>

              <div className='mb-6 space-y-2'>
                <h3 className='font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-gray-200 transition-colors'>
                  {item.titulo}
                </h3>
                <p className='text-sm text-gray-400 line-clamp-3 leading-relaxed'>
                  {item.descripcion}
                </p>
              </div>
            </div>

            <div>
              <div className='flex flex-col gap-2 text-xs text-gray-400 font-medium border-t border-gray-700 pt-4 mb-4'>
                <div className='flex items-center gap-2'>
                  <Clock className='w-3.5 h-3.5' />
                  Publicado: {dayjs(item.created_at).format('D MMM, hh:mm A')}
                </div>

                {item.fecha_expiracion && (
                  <div
                    className={`flex items-center gap-2 font-semibold ${isExpired ? 'text-red-400' : 'text-gray-400'}`}
                  >
                    <Clock className='w-3.5 h-3.5' />
                    {isExpired
                      ? 'Expirada'
                      : `Vence: ${dayjs(item.fecha_expiracion).fromNow()}`}
                  </div>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={() => onEdit(item)}
                  className='flex-1 py-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-bold border border-gray-700 hover:border-emerald-500/30'
                >
                  <Edit className='w-3.5 h-3.5' />
                  Editar
                </button>

                <div className='w-px h-4 bg-gray-700'></div>

                <button
                  onClick={() => onDelete(item.id)}
                  className='flex-1 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-bold border border-gray-700 hover:border-red-500/30'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
