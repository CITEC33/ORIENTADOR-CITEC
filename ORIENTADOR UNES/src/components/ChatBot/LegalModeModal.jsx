import { CheckCircle, ClipboardCheck, X } from 'lucide-react'

export default function LegalModeModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='glass-strong border border-violet-500/30 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-violet-glow relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-500/20 transition-all'
          aria-label='Cerrar'
        >
          <X className='w-5 h-5 text-slate-400' />
        </button>

        <div className='flex items-center gap-3 mb-4 pr-6'>
          <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-violet-glow shrink-0'>
            <ClipboardCheck className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-semibold text-slate-100 leading-tight'>
              Modo Admisiones
            </h3>
            <p className='text-xs sm:text-sm text-slate-400'>
              Respuestas enfocadas en ingreso a UNES
            </p>
          </div>
        </div>

        <div className='space-y-3 mb-6'>
          <p className='text-slate-300 text-xs sm:text-sm leading-relaxed'>
            El <strong className='text-violet-400'>Modo Admisiones</strong>{' '}
            ayuda a Aquila a priorizar informacion sobre carreras, requisitos,
            becas, horarios y pasos para solicitar informacion.
          </p>

          <div className='bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 space-y-2'>
            <p className='text-violet-300 text-[10px] sm:text-xs font-medium flex items-start gap-2'>
              <CheckCircle className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 mt-0.5 shrink-0' />
              <span>Ideal para dudas sobre admisiones y oferta academica.</span>
            </p>
            <p className='text-violet-300 text-[10px] sm:text-xs font-medium flex items-start gap-2'>
              <CheckCircle className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 mt-0.5 shrink-0' />
              <span>Permite comparar carreras por intereses y habilidades.</span>
            </p>
            <p className='text-violet-300 text-[10px] sm:text-xs font-medium flex items-start gap-2'>
              <CheckCircle className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 mt-0.5 shrink-0' />
              <span>Orienta tu proyecto de vida universitaria en UNES Durango.</span>
            </p>
          </div>

          <p className='text-slate-400 text-[10px] sm:text-xs italic'>
            Puedes desactivarlo en cualquier momento desde el boton en la barra
            inferior.
          </p>
        </div>

        <div className='flex gap-2 sm:gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm sm:text-base font-medium transition-all border border-slate-600/30'
          >
            Ahora no
          </button>
          <button
            onClick={handleConfirm}
            className='flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm sm:text-base font-medium transition-all shadow-violet-glow'
          >
            Activar
          </button>
        </div>
      </div>
    </div>
  )
}
