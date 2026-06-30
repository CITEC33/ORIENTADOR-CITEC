import { ClipboardCheck, Send } from 'lucide-react'
import { useMessageInput } from '../../hooks/useMessageInput'

export function MessageInput({
  onSend,
  disabled = false,
  isLegalMode = false,
  onToggleLegalMode
}) {
  const {
    message,
    setMessage,
    isFocused,
    setIsFocused,
    inputRef,
    handleSubmit,
    handleKeyDown
  } = useMessageInput({
    onSend,
    disabled
  })

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div
        className={`
          flex flex-col gap-2 sm:gap-0 p-1
          bg-gray-900
          border-2 rounded-2xl
          transition-all duration-300
          ${
            isFocused
              ? 'border-primary-violet shadow-violet-glow'
              : 'border-primary-violet/20 shadow-md'
          }
        `}
      >
        {onToggleLegalMode && (
          <button
            type='button'
            onClick={onToggleLegalMode}
            disabled={disabled}
            className={`
              sm:hidden w-fit flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 border-2
              ${
                isLegalMode
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-400/50 border-violet-500'
                  : 'bg-purple-300 text-violet-950 border-purple-800 shadow-sm'
              }
            `}
            title={
              isLegalMode
                ? 'Desactivar Modo Admisiones'
                : 'Activar Modo Admisiones'
            }
          >
            <ClipboardCheck className='w-3.5 h-3.5' />
            {isLegalMode
              ? 'Modo Admisiones Activo'
              : 'Modo Admisiones Desactivado'}
          </button>
        )}

        <div className='flex items-center w-full'>
          {onToggleLegalMode && (
            <button
              type='button'
              onClick={onToggleLegalMode}
              disabled={disabled}
              className={`
                hidden sm:flex px-2.5 py-2.5 rounded-2xl
                items-center justify-center shrink-0
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-105 active:scale-95
                border-2
                ${
                  isLegalMode
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-400/50 border-violet-500'
                    : 'bg-purple-300 text-violet-950 border-purple-800 shadow-violet-glow'
                }
              `}
              title={
                isLegalMode
                  ? 'Desactivar Modo Admisiones'
                  : 'Activar Modo Admisiones'
              }
              aria-label={
                isLegalMode
                  ? 'Desactivar Modo Admisiones'
                  : 'Activar Modo Admisiones'
              }
            >
              <ClipboardCheck className='w-5 h-5' />
            </button>
          )}

          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={
              isLegalMode
                ? 'Escribe tu duda de admisiones...'
                : 'Escribe tu duda vocacional...'
            }
            disabled={disabled}
            maxLength={2000}
            rows={1}
            className='
              flex-1 resize-none
              bg-transparent border-none outline-none
              placeholder-gray-400
              text-base leading-relaxed
              max-h-[120px] overflow-y-auto
              disabled:opacity-50 disabled:cursor-not-allowed
              py-2 sm:py-3 px-1 sm:px-2
            '
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#6B3FA0 transparent'
            }}
          />

          <button
            type='submit'
            disabled={!message.trim() || disabled || message.length >= 2000}
            className='pr-2.5 pl-2 py-2.5 rounded-full bg-gradient-to-br from-primary-violet to-light-violet text-white flex items-center justify-center shrink-0 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95 shadow-violet-glow'
            aria-label='Enviar mensaje'
          >
            <Send className='w-4 h-4 rotate-45' />
          </button>
        </div>
      </div>

      <div className='flex items-center justify-end mr-2 text-[10px] sm:text-xs text-gray-500'>
        <span
          className={
            message.length > 1800 ? 'text-warning-yellow font-semibold' : ''
          }
        >
          {message.length}/2000
        </span>
      </div>
    </form>
  )
}
