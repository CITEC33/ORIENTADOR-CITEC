import { X, Bell, Check, Clock, CheckCheck } from 'lucide-react'
import { useNotificaciones } from '../../hooks/useNotificaciones'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import { Link } from 'react-router-dom'

dayjs.extend(relativeTime)
dayjs.locale('es')

export function NotificationHistory({ isOpen, onClose }) {
  const {
    notificaciones,
    isLoading,
    marcarComoLeida,
    marcarTodasComoLeidas,
    unreadCount
  } = useNotificaciones()

  if (!isOpen) return null

  return (
    <>
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity'
        onClick={onClose}
      />

      <div className='fixed right-0 top-0 h-full w-full sm:max-w-sm bg-gray-900 shadow-2xl border-l border-gray-700 z-50 flex flex-col animate-in slide-in-from-right duration-300'>
        <div className='p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Bell className='w-5 h-5 text-purple-400' />
            <h2 className='font-bold text-white'>Notificaciones de hoy</h2>
          </div>

          <div className='flex items-center gap-2'>
            {unreadCount > 0 && (
              <button
                onClick={marcarTodasComoLeidas}
                title='Marcar todas como leídas'
                className='flex items-center gap-1 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg transition-colors border border-purple-500/20'
              >
                <CheckCheck className='w-3.5 h-3.5' />
                <span className='hidden sm:inline'>Leído</span>
              </button>
            )}
            <button
              onClick={onClose}
              className='p-1 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto bg-gray-900 p-2 space-y-2'>
          {isLoading ? (
            <div className='p-8 text-center text-gray-500'>
              <div className='animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent mx-auto mb-2'></div>
              Cargando...
            </div>
          ) : notificaciones.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-gray-500 text-center p-4'>
              <Bell className='w-12 h-12 mb-2 opacity-20' />
              <p className='text-sm font-medium'>Todo está tranquilo</p>
              <p className='text-xs'>No hay nuevas notificaciones</p>
            </div>
          ) : (
            notificaciones.map((notif) => (
              <Link
                key={notif.id}
                to={`/incidentes${notif?.incidentes?.folio ? `?id=${notif.incidentes.folio}&nombre=${encodeURIComponent(`${notif.incidentes.usuarias.nombre_completo} ${notif.incidentes.usuarias.apellido_p} ${notif.incidentes.usuarias.apellido_m}`)}` : ''}`}
                onClick={onClose}
                className={`
                  relative p-4 rounded-xl border transition-all block group 
                  ${
                    notif.estatus === 'Pendiente'
                      ? 'bg-gray-800 border-purple-500/30 shadow-md hover:border-purple-500/50'
                      : 'bg-gray-900 border-gray-800 opacity-60 hover:opacity-100 hover:bg-gray-800'
                  }
                `}
              >
                {notif.estatus === 'Pendiente' && (
                  <span className='absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full shadow-sm ring-2 ring-gray-800' />
                )}

                <h3
                  className={`font-bold text-sm mb-1 ${notif.estatus === 'Pendiente' ? 'text-white' : 'text-gray-400'}`}
                >
                  {notif.titulo}
                </h3>

                <p className='text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3'>
                  {notif.mensaje}
                </p>

                <div className='flex items-center justify-between mt-2'>
                  <span className='flex items-center gap-1 text-[10px] font-medium text-gray-500'>
                    <Clock className='w-3 h-3' />
                    {dayjs(notif.created_at).fromNow()}
                  </span>

                  {notif.estatus === 'Pendiente' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        marcarComoLeida(notif.id)
                      }}
                      className='relative z-10 text-[10px] font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-purple-300'
                    >
                      Marcar leída <Check className='w-3 h-3' />
                    </button>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  )
}
