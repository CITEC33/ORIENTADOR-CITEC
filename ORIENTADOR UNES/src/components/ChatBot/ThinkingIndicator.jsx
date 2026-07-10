import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThinkingIndicator({ duration = 5000 }) {
  const [showSlowMessage, setShowSlowMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div className='flex justify-start mb-3 sm:mb-4 animate-[slideIn_0.3s_ease-out]'>
      <div className='flex flex-col gap-2 sm:gap-3 max-w-[85%] md:max-w-[75%]'>
        <div className='flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl glass border border-violet-500/20 w-fit'>
          <div className='flex items-center gap-1 sm:gap-1.5'>
            <div
              className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-violet-400'
              style={{
                animation: 'bubbleThinking 1.4s ease-in-out infinite',
                animationDelay: '0s',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)'
              }}
            />
            <div
              className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-violet-400'
              style={{
                animation: 'bubbleThinking 1.4s ease-in-out infinite',
                animationDelay: '0.2s',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)'
              }}
            />
            <div
              className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-violet-400'
              style={{
                animation: 'bubbleThinking 1.4s ease-in-out infinite',
                animationDelay: '0.4s',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)'
              }}
            />
          </div>
          <span className='text-slate-300 text-xs sm:text-sm font-medium'>
            Aquila está pensando...
          </span>
        </div>

        {showSlowMessage && (
          <div
            className='px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl glass border border-purple-500/20 animate-[slideIn_0.5s_ease-out] w-fit'
            style={{
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
            }}
          >
            <div className='flex items-start gap-2'>
              <Clock className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 mt-0.5 shrink-0' />
              <div className='flex-1 min-w-0'>
                <p className='text-purple-300 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1'>
                  Procesando tu consulta...
                </p>
                <p className='text-slate-400 text-[10px] sm:text-xs leading-relaxed max-w-xs'>
                  Esto puede tardar hasta{' '}
                  <strong className='text-purple-400'>3 minutos</strong>{' '}
                  mientras busco la mejor información.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
