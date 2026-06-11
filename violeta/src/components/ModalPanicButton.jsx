import { AlertTriangle, Phone, X } from 'lucide-react'
import { usePanicButton } from '../hooks/usePanicButton'
import { Link } from 'react-router-dom'

export const ModalPanicButton = ({ handleModal, message }) => {
  const { loading } = usePanicButton()

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity'
        onClick={handleModal}
      />

      <div className='relative bg-gray-900 w-full max-w-xl rounded-xl shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-700'>
        <div className='bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center'>
          <div>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='text-red-500 w-5 h-5 animate-pulse' />
              <h2 className='text-lg font-bold text-white'>Centro de Ayuda</h2>
            </div>
            <Link
              to='/mis-alertas'
              onClick={handleModal}
              className='text-red-400 text-xs underline block hover:text-red-300 mt-1 font-medium'
            >
              Dale seguimiento a tu alerta. Puedes agregar una nota a tu folio
              desde aquí.
            </Link>
          </div>
          <button
            onClick={handleModal}
            className='text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6'>
          <h3 className='text-2xl font-bold text-white text-center'>
            ¿Qué más deseas hacer?
          </h3>
          {message && (
            <p className='text-gray-400 text-center mt-2 text-sm px-4'>
              {message}
            </p>
          )}

          <div className='flex flex-col gap-4 mt-6'>
            <a
              href='tel:6181378130'
              disabled={loading}
              className='w-full py-4 px-6 rounded-lg font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-500 active:scale-95 border border-red-500 ring-2 ring-transparent hover:ring-red-500/50 disabled:pointer-events-none disabled:bg-gray-700 disabled:shadow-none'
            >
              <Phone className='w-6 h-6 shrink-0' />
              <span>Llama para recibir acompañamiento</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
