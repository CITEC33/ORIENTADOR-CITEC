import { useEffect, useState } from 'react'
import { HelpCircle, X, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Botón "?" que abre un modal con el deslinde legal sobre las respuestas de la IA.
 * Aparece en el header del Home y del Chat.
 *
 * Props:
 *  - variant: 'home' | 'chat'  (ajusta tamaño y estilo del botón)
 *  - className: clases extras
 */
const AiDisclaimerButton = ({ variant = 'home', className = '' }) => {
  const [open, setOpen] = useState(false)

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    // Bloquear scroll del body cuando el modal está abierto
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const isHome = variant === 'home'

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='Aviso sobre respuestas de la IA'
        title='Aviso sobre respuestas de la IA'
        className={
          isHome
            ? `relative w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 ${className}`
            : `w-9 h-9 sm:w-10 sm:h-10 rounded-full glass border border-slate-600/30 hover:border-amber-500/60 hover:scale-110 transition-all duration-200 flex items-center justify-center text-amber-300 shrink-0 ${className}`
        }
        style={
          isHome
            ? {
                background:
                  'linear-gradient(145deg, rgba(251,191,36,0.30), rgba(217,119,6,0.55))',
                border: '1px solid rgba(253,224,71,0.45)',
                backdropFilter: 'blur(8px)',
                boxShadow:
                  '0 6px 18px rgba(2,13,51,0.45), inset 0 1px 0 rgba(255,255,255,0.20)'
              }
            : { boxShadow: '0 0 20px rgba(251, 191, 36, 0.15)' }
        }
      >
        <HelpCircle className={isHome ? 'w-5 h-5' : 'w-4 h-4 sm:w-5 sm:h-5'} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className='fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm'
              aria-hidden
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role='dialog'
              aria-modal='true'
              aria-labelledby='ai-disclaimer-title'
              className='fixed inset-0 z-[101] flex items-center justify-center p-4'
            >
              <div
                className='relative w-full max-w-md rounded-3xl overflow-hidden'
                style={{
                  background:
                    'linear-gradient(160deg, rgba(15,42,102,0.98), rgba(9,26,64,0.98))',
                  border: '1px solid rgba(147,197,253,0.25)',
                  boxShadow:
                    '0 24px 60px rgba(2,6,23,0.7), 0 0 0 1px rgba(59,130,246,0.15) inset'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header ámbar */}
                <div
                  className='px-5 pt-5 pb-4 border-b border-amber-400/20'
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(251,191,36,0.14), rgba(217,119,6,0.06))'
                  }}
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className='w-11 h-11 rounded-2xl flex items-center justify-center shrink-0'
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(251,191,36,0.35), rgba(217,119,6,0.55))',
                        border: '1px solid rgba(253,224,71,0.5)',
                        boxShadow: '0 6px 16px rgba(217,119,6,0.4)'
                      }}
                    >
                      <AlertTriangle className='w-5 h-5 text-white' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h2
                        id='ai-disclaimer-title'
                        className='text-lg font-bold text-white leading-tight'
                      >
                        Aviso importante
                      </h2>
                      <p className='text-xs text-amber-200/85 mt-0.5'>
                        Sobre las respuestas de Aquila
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => setOpen(false)}
                      aria-label='Cerrar aviso'
                      className='w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className='px-5 py-5 space-y-3.5 text-sm text-blue-50/90 leading-relaxed'>
                  <p>
                    Lo que responde <strong className='text-white'>Aquila</strong> es{' '}
                    <strong className='text-amber-300'>
                      meramente informativo y orientativo
                    </strong>
                    . No sustituye la asesoría oficial de un orientador,
                    coordinador académico o representante de UNES Durango.
                  </p>

                  <p>
                    Aquila utiliza inteligencia artificial y puede{' '}
                    <strong className='text-white'>equivocarse</strong> u ofrecer
                    información desactualizada, especialmente en cuanto a{' '}
                    <em>costos, fechas, requisitos exactos, becas vigentes</em> y{' '}
                    <em>convocatorias</em>.
                  </p>

                  <div
                    className='rounded-xl p-3.5 text-xs'
                    style={{
                      background: 'rgba(59,130,246,0.10)',
                      border: '1px solid rgba(147,197,253,0.20)'
                    }}
                  >
                    <p className='text-blue-100/90 font-semibold mb-1.5'>
                      Para información oficial y actualizada
                    </p>
                    <ul className='space-y-1 text-blue-200/85'>
                      <li>
                        📞 <strong>618 833 9000</strong>
                      </li>
                      <li>
                        💬 WhatsApp <strong>618 170 9766</strong>
                      </li>
                      <li>
                        ✉️ <strong>difusion@unes.edu.mx</strong>
                      </li>
                      <li>
                        🌐{' '}
                        <a
                          href='https://unes.edu.mx'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='underline hover:text-white'
                        >
                          unes.edu.mx
                        </a>
                      </li>
                    </ul>
                  </div>

                  <p className='text-xs text-blue-200/70'>
                    Al usar Aquila reconoces y aceptas que las respuestas de la
                    IA son una guía y no constituyen un compromiso institucional
                    de UNES.
                  </p>
                </div>

                {/* Footer */}
                <div className='px-5 pb-5'>
                  <button
                    type='button'
                    onClick={() => setOpen(false)}
                    className='w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-95'
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      boxShadow: '0 6px 18px rgba(59,130,246,0.4)'
                    }}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AiDisclaimerButton
