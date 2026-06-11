import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Clock, X } from 'lucide-react'
import { useNotificacionesUsuaria } from '../hooks/useNotificacionesUsuaria'

const typeConfig = {
  alerta: {
    unread: 'border-red-500/40 bg-red-950/25',
    read: 'border-gray-800 bg-gray-900/30',
    label: 'Alerta'
  },
  exito: {
    unread: 'border-emerald-500/40 bg-emerald-950/20',
    read: 'border-gray-800 bg-gray-900/30',
    label: 'Actualización'
  },
  info: {
    unread: 'border-purple-500/40 bg-purple-950/20',
    read: 'border-gray-800 bg-gray-900/30',
    label: 'Información'
  }
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absDiff = Math.abs(diffInSeconds)
  const formatter = new Intl.RelativeTimeFormat('es-MX', { numeric: 'auto' })

  if (absDiff < 60) return 'hace unos segundos'
  if (absDiff < 3600) {
    return formatter.format(Math.round(diffInSeconds / 60), 'minute')
  }
  if (absDiff < 86400) {
    return formatter.format(Math.round(diffInSeconds / 3600), 'hour')
  }
  if (absDiff < 2592000) {
    return formatter.format(Math.round(diffInSeconds / 86400), 'day')
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const NotificacionItem = ({ notification, onClick }) => {
  const isRead = Boolean(notification.leida_en)
  const config = typeConfig[notification.tipo] || typeConfig.info

  return (
    <button
      type='button'
      onClick={() => onClick(notification)}
      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 hover:border-purple-400/50 hover:bg-gray-800/70 active:scale-[0.99] ${
        isRead ? `${config.read} opacity-55` : config.unread
      }`}
    >
      <div className='flex items-start gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                {config.label}
              </p>
              <h3 className='mt-1 line-clamp-2 text-sm font-bold leading-snug text-gray-100'>
                {notification.titulo}
              </h3>
            </div>

            {!isRead && (
              <span className='mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' />
            )}
          </div>

          <p className='mt-2 text-sm text-gray-400 leading-relaxed mb-3 line-clamp-3'>
            {notification.mensaje}
          </p>

          <div className='mt-3 flex items-center gap-1.5 text-[11px] font-medium text-gray-500'>
            <Clock className='h-3.5 w-3.5' />
            {formatRelativeTime(notification.created_at)}
          </div>
        </div>
      </div>
    </button>
  )
}

export const NotificacionesUsuaria = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const {
    notificaciones,
    isLoading,
    unreadCount,
    marcarComoLeida,
    marcarTodasComoLeidas,
    isMarkingAllRead
  } = useNotificacionesUsuaria()

  const orderedNotifications = useMemo(
    () =>
      [...notificaciones].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ),
    [notificaciones]
  )

  const handleNotificationClick = (notification) => {
    if (!notification.leida_en) {
      marcarComoLeida(notification.id)
    }

    setIsOpen(false)
    navigate('/mis-alertas')
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-700 bg-gray-900/95 text-purple-300 shadow-2xl shadow-black/40 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-purple-500/50 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/60 sm:right-6'
        style={{
          top: 'calc(0.5rem + env(safe-area-inset-top))'
        }}
        aria-label='Abrir notificaciones'
      >
        <Bell className='h-6 w-6' />

        {unreadCount > 0 && (
          <span className='absolute -right-1.5 -top-1.5 flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 border-gray-900 bg-red-500 px-1.5 text-xs font-black text-white shadow-lg shadow-red-950/50'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 animate-in fade-in duration-200'>
          <div
            className='absolute inset-0 bg-black/55 backdrop-blur-sm'
            onClick={() => setIsOpen(false)}
          />

          <aside
            className='fixed right-0 top-0 h-full w-full sm:max-w-sm bg-gray-900 shadow-2xl border-l border-gray-700 z-50 flex flex-col animate-in slide-in-from-right duration-300'
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            <div className='p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between'>
              <div className='flex min-w-0 items-center gap-3'>
                <Bell className='w-6 h-6 text-purple-400' />
                <div className='min-w-0'>
                  <h2 className='text-lg font-bold text-white'>
                    Notificaciones
                  </h2>
                  <p className='text-xs font-medium text-gray-500'>
                    {unreadCount > 0
                      ? `${unreadCount} sin leer`
                      : 'Todo al día'}
                  </p>
                </div>
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                {unreadCount > 0 && (
                  <button
                    type='button'
                    onClick={() => marcarTodasComoLeidas()}
                    disabled={isMarkingAllRead}
                    className='flex items-center gap-1 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg transition-colors border border-purple-500/20'
                    aria-label='Marcar todas las notificaciones como leídas'
                    title='Marcar todas como leídas'
                  >
                    <CheckCheck className='w-3.5 h-3.5' />
                    <span className='hidden sm:inline'>Marcar leídas</span>
                  </button>
                )}

                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white'
                  aria-label='Cerrar notificaciones'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto bg-gray-900 p-2 space-y-2'>
              {isLoading ? (
                <div className='p-8 text-center text-gray-500'>
                  <div className='animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent mx-auto mb-2'></div>
                  Cargando...
                </div>
              ) : orderedNotifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-64 text-gray-500 text-center p-4'>
                  <Bell className='w-12 h-12 mb-2 opacity-20' />
                  <p className='text-sm font-medium'>Sin notificaciones</p>
                  <p className='text-xs'>
                    Las actualizaciones de tus alertas aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className='space-y-3 pb-4'>
                  {orderedNotifications.map((notification) => (
                    <NotificacionItem
                      key={notification.id}
                      notification={notification}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
