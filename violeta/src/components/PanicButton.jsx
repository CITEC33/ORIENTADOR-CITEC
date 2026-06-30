import { Send } from 'lucide-react'

export const PanicButton = ({ mode, handleModal, setMessage }) => {
  const handleRequestInfo = () => {
    setMessage?.(
      'Violeta puede ayudarte a ordenar tus dudas sobre carreras, costos, horarios, becas y proceso de admision.'
    )
    handleModal?.()
  }

  return (
    <>
      <button
        onClick={handleRequestInfo}
        className={`w-full py-2.5 px-4 rounded-md font-bold shadow-sm flex items-center justify-center gap-2 transition-all bg-blue-600 text-white hover:bg-blue-700 ${
          mode === 'sidebar' ? 'text-sm' : 'text-xl'
        }`}
      >
        <Send className='w-6 h-6' />
        Solicitar informacion
      </button>
      <p className='text-blue-300 text-xs underline text-center mt-3'>
        Comparte tus dudas de admisiones, oferta academica o vida
        universitaria.
      </p>
    </>
  )
}
