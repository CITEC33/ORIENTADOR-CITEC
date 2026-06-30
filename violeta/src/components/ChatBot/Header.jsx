import { memo } from 'react'
import { AlertTriangle, Bot, Lock, Send, Trash2 } from 'lucide-react'
import video from '../../assets/imgs/violeta-avatar.mp4'
import poster from '../../assets/imgs/violeta-orienta-avatar.png'

export const Header = memo(function Header({
  isConnected,
  onClearChat,
  onHistoryClick,
  dailyMessagesUsed = 0,
  dailyMessagesMax = 20
}) {
  const remaining = dailyMessagesMax - dailyMessagesUsed
  const isLowMessages = remaining <= 5 && remaining > 0
  const isBlocked = remaining <= 0

  return (
    <header className='glass-strong p-2 rounded-xl mb-2 relative z-10 shrink-0'>
      <div className='flex items-center justify-center'>
        <div
          className={`
            flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg
            glass border transition-all duration-300
            ${
              isBlocked
                ? 'border-red-500/40 bg-red-500/10'
                : isLowMessages
                ? 'border-yellow-500/40 bg-yellow-500/10'
                : 'border-blue-500/30 bg-blue-500/5'
            }
          `}
          style={{
            boxShadow: isBlocked
              ? '0 0 20px rgba(239, 68, 68, 0.15)'
              : isLowMessages
              ? '0 0 20px rgba(251, 191, 36, 0.15)'
              : '0 0 15px rgba(59, 130, 246, 0.1)'
          }}
        >
          {isBlocked ? (
            <Lock className='w-3 h-3 sm:w-4 sm:h-4 text-red-400' />
          ) : (
            <Send className='w-3 h-3 sm:w-4 sm:h-4 text-blue-400' />
          )}
          <span
            className={`text-[10px] sm:text-xs font-medium ${
              isBlocked
                ? 'text-red-300'
                : isLowMessages
                ? 'text-yellow-300'
                : 'text-slate-300'
            }`}
          >
            Mensajes:
            <strong
              className={`ml-0.5 ${
                isBlocked
                  ? 'text-red-400'
                  : isLowMessages
                  ? 'text-yellow-400'
                  : 'text-blue-400'
              }`}
            >
              {dailyMessagesUsed}/{dailyMessagesMax}
            </strong>
          </span>

          {isLowMessages && !isBlocked && (
            <AlertTriangle className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse' />
          )}
        </div>
      </div>

      <div className='flex items-center justify-between gap-2 pt-5 sm:pt-3 lg:pt-0'>
        <div className='flex items-center gap-2 sm:gap-4 min-w-0'>
          <div
            className='w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-violet-500/30 flex items-center justify-center shrink-0'
            style={{
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
            }}
          >
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              poster={poster}
              className='w-full h-full object-cover rounded-full'
              aria-label='Violeta orientadora avatar animado'
              style={{ objectPosition: 'center center' }}
            />
          </div>
          <div className='min-w-0'>
            <h1 className='text-lg sm:text-2xl font-bold text-gradient-blue leading-tight truncate'>
              Violeta
            </h1>
            <p className='text-xs sm:text-sm text-slate-400 leading-tight truncate max-w-[140px] sm:max-w-none'>
              Asistente vocacional UNES
            </p>
          </div>
        </div>

        <div className='flex items-center gap-1.5 sm:gap-3 shrink-0'>
          <div className='hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-slate-600/30'>
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.6)]'
                  : 'bg-slate-500'
              }`}
            ></span>
            <span className='text-[10px] font-medium text-slate-300'>
              {isConnected ? 'Conectado' : 'Offline'}
            </span>
          </div>

          <button
            onClick={onHistoryClick}
            className='
              w-9 h-9 sm:w-10 sm:h-10 rounded-full
              glass border border-slate-600/30
              hover:border-blue-500/60 hover:scale-110
              transition-all duration-200
              flex items-center justify-center
              relative shrink-0
            '
            title='Historial de orientacion'
            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
          >
            <Bot className='w-4 h-4 sm:w-5 sm:h-5 text-blue-400' />
          </button>

          {onClearChat && (
            <button
              onClick={onClearChat}
              className='
                w-9 h-9 sm:w-10 sm:h-10 rounded-full
                glass border border-slate-600/30
                flex items-center justify-center
                text-slate-400 text-base
                transition-all duration-300
                hover:border-red-500/60 hover:text-red-400 hover:scale-110
                active:scale-95 shrink-0
              '
              title='Limpiar chat'
              style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)' }}
            >
              <Trash2 className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
          )}
        </div>
      </div>
    </header>
  )
})
