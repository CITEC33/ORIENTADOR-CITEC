import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Header = ({ isProfileComplete }) => {
  return (
    <div className='mb-6 space-y-4'>
      {!isProfileComplete ? (
        <div className='bg-amber-900/20 border-l-4 border-amber-500 p-2 sm:p-4 rounded-r-lg shadow-lg shadow-amber-900/10 animate-pulse backdrop-blur-sm'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
            </div>
            <div className='ml-3'>
              <p className='text-sm text-amber-400 font-bold'>
                Completa tu perfil
              </p>
              <p className='text-sm text-amber-200/80 mt-1'>
                Agrega tus datos principales para que Violeta pueda orientar
                mejor tus dudas sobre carreras, admisiones y vida universitaria.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Volver al inicio</span>
        </Link>
      )}

      <div>
        <h1 className='text-3xl font-bold text-white'>Mi Perfil</h1>
        <p className='text-gray-400 mt-2'>
          Administra tu informacion personal y preferencias de orientacion.
        </p>
      </div>
    </div>
  )
}
