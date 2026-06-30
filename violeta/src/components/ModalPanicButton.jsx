import { GraduationCap, Info, MessageCircle, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ModalPanicButton = ({ handleModal, message }) => {
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
              <GraduationCap className='text-blue-400 w-5 h-5' />
              <h2 className='text-lg font-bold text-white'>
                Solicitud de informacion
              </h2>
            </div>
            <Link
              to='/mi-orientacion'
              onClick={handleModal}
              className='text-blue-300 text-xs underline block hover:text-blue-200 mt-1 font-medium'
            >
              Consulta tus avances, notas y solicitudes de orientacion.
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
            Que deseas hacer ahora?
          </h3>
          {message && (
            <p className='text-gray-400 text-center mt-2 text-sm px-4'>
              {message}
            </p>
          )}

          <div className='flex flex-col gap-4 mt-6'>
            <Link
              to='/chat'
              onClick={handleModal}
              className='w-full py-4 px-6 rounded-lg font-bold shadow-[0_0_15px_rgba(37,99,235,0.35)] flex items-center justify-center gap-3 transition-all bg-blue-600 text-white hover:bg-blue-500 active:scale-95 border border-blue-500 ring-2 ring-transparent hover:ring-blue-500/50'
            >
              <MessageCircle className='w-6 h-6 shrink-0' />
              <span>Hablar con Violeta sobre admisiones</span>
            </Link>

            <Link
              to='/vida-unes'
              onClick={handleModal}
              className='w-full py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-3 transition-all bg-gray-800 text-blue-100 hover:bg-gray-700 active:scale-95 border border-blue-500/30'
            >
              <Info className='w-6 h-6 shrink-0' />
              <span>Ver recursos y vida UNES</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
