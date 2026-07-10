import { Send } from 'lucide-react'

export const PanicButton = ({ mode, handleModal, setMessage }) => {
  const handleRequestInfo = () => {
    setMessage?.(
      'Aquila puede ayudarte a ordenar tus dudas sobre carreras, costos, horarios, becas y proceso de admisión.'
    )
    handleModal?.()
  }

  return (
    <>
      <button
        onClick={handleRequestInfo}
        className={`w-full py-2.5 px-4 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all text-white ${
          mode === 'sidebar' ? 'text-sm' : 'text-lg'
        }`}
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow:
            '0 6px 18px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
        }}
      >
        <Send className='w-5 h-5' />
        Solicitar información
      </button>
      <p className='text-sky-300/90 text-xs text-center mt-3'>
        Comparte tus dudas de admisiones, oferta académica o vida
        universitaria.
      </p>
    </>
  )
}
