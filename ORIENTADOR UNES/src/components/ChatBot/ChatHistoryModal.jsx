import {
  History,
  Info,
  Lock,
  MessageCircle,
  MessageSquareIcon,
  Send,
  Trash2,
  X
} from 'lucide-react'
import Swal from 'sweetalert2'

const darkSwal = Swal.mixin({
  customClass: {
    popup:
      'bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl shadow-black/50 mx-4 sm:mx-0',
    title: 'text-lg sm:text-xl font-bold text-white',
    htmlContainer: 'text-gray-400 text-sm',
    confirmButton:
      'bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all transform active:scale-95 text-sm sm:text-base',
    cancelButton:
      'bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl transition-all transform active:scale-95 text-sm sm:text-base',
    actions:
      'gap-3 sm:gap-4 flex flex-col-reverse sm:flex-row justify-center w-full px-4'
  },
  buttonsStyling: false,
  background: '#111827',
  color: '#f3f4f6'
})

export function ChatHistoryModal({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession
}) {
  if (!isOpen) return null

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hoy ${date.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ayer ${date.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else {
      return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getPreview = (messages) => {
    if (messages.length === 0) return 'Chat vacío'
    const lastMessage = messages[messages.length - 1]
    const preview = lastMessage.content.substring(0, 60)
    return preview.length < lastMessage.content.length
      ? `${preview}...`
      : preview
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden animate-[scale-in_0.2s_ease-out]'>
        <div className='p-3 sm:p-4 md:p-6 border-b border-gray-800 shrink-0'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
              <div className='w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-violet to-light-violet flex items-center justify-center shadow-violet-glow shrink-0'>
                <History className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
              </div>
              <div className='min-w-0'>
                <h2 className='text-base sm:text-xl md:text-2xl font-bold text-white leading-tight truncate'>
                  Historial de Chats
                </h2>
                <p className='text-[10px] sm:text-sm text-gray-400 truncate'>
                  {sessions.length} de 2 chats guardados
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0'
              aria-label='Cerrar'
            >
              <X className='w-5 h-5 sm:w-6 sm:h-6' />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-2.5 sm:space-y-3'>
          {sessions.length === 0 ? (
            <div className='text-center py-8 sm:py-12'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
                <MessageCircle className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
              </div>
              <p className='text-xs sm:text-sm md:text-base text-gray-500'>
                No hay chats guardados
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId
              const isBlocked =
                session.blockedUntil && Date.now() < session.blockedUntil

              return (
                <div
                  key={session.id}
                  className={`
                    relative p-2.5 sm:p-4 rounded-xl border-2 cursor-pointer
                    transition-all duration-200
                    ${
                      isActive
                        ? 'border-primary-violet bg-primary-violet/5 shadow-violet-glow'
                        : 'border-gray-800 hover:border-primary-violet/50 hover:bg-primary-violet/30'
                    }
                  `}
                  onClick={() => !isActive && onSelectSession(session.id)}
                >
                  <div className='flex items-start gap-2.5 sm:gap-4'>
                    <div
                      className={`
                      w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0
                      ${
                        isActive
                          ? 'bg-gradient-to-br from-primary-violet to-light-violet text-white'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                    >
                      <MessageSquareIcon className='w-4 h-4 sm:w-6 sm:h-6' />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-wrap items-center justify-between mb-0.5 sm:mb-1 gap-x-2 gap-y-0.5'>
                        <h3 className='font-semibold text-white text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 truncate'>
                          Chat {sessions.indexOf(session) + 1}
                          {isActive && (
                            <span className='px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs bg-primary-violet text-white rounded-full shrink-0'>
                              Activo
                            </span>
                          )}
                          {isBlocked && (
                            <span className='px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs bg-alert-red text-white rounded-full flex items-center gap-1 shrink-0'>
                              <Lock className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
                              Bloqueado
                            </span>
                          )}
                        </h3>
                        <span className='text-[10px] sm:text-xs text-gray-400 whitespace-nowrap shrink-0'>
                          {formatDate(session.createdAt)}
                        </span>
                      </div>

                      <p className='text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2 truncate'>
                        {getPreview(session.messages)}
                      </p>

                      <div className='flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500'>
                        <span className='flex gap-1 items-center whitespace-nowrap'>
                          <MessageCircle className='w-3 h-3 sm:w-4 sm:h-4' />
                          {session.messages.length} mensajes
                        </span>
                        <span className='flex gap-1 items-center whitespace-nowrap'>
                          <Send className='w-3 h-3 sm:w-4 sm:h-4' />
                          {session.messageCount}/20 enviados
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        darkSwal
                          .fire({
                            title:
                              '¿Estás segura de que deseas limpiar el chat actual?',
                            text: 'Esta acción no se puede deshacer y se perderá todo el historial de esta conversación.',
                            icon: 'warning',
                            iconColor: '#ef4444',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, limpiar chat',
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true
                          })
                          .then(async (result) => {
                            if (result.isConfirmed) {
                              onDeleteSession(session.id)
                            }
                          })
                      }}
                      className='
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full
                        flex items-center justify-center shrink-0
                        text-gray-400 hover:text-red-500 hover:bg-red-500/10
                        transition-colors
                      '
                      title='Limpiar chat'
                      aria-label='Limpiar chat'
                    >
                      <Trash2 className='w-4 h-4 sm:w-5 sm:h-5' />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className='p-3 sm:p-4 md:p-6 border-t border-gray-800 bg-gray-800 shrink-0'>
          <div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-sm'>
            <p className='text-gray-400 text-[10px] sm:text-xs md:text-sm text-center sm:text-left leading-tight'>
              <Info className='w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2 align-text-bottom' />
              Los chats se pueden limpiar pero no eliminar.
            </p>
            <button
              onClick={onClose}
              className='
                w-full sm:w-auto px-6 py-2 sm:py-2.5 rounded-lg
                bg-primary-violet text-white
                hover:scale-105
                transition-transform
                font-medium text-sm sm:text-base
              '
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
