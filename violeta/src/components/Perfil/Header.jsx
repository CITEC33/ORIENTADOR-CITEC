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
                Acción Requerida
              </p>
              <p className='text-sm text-amber-200/80 mt-1'>
                Para usar la plataforma, debes completar tu{' '}
                <strong className='text-amber-200'>apellido paterno</strong>,{' '}
                <strong className='text-amber-200'>apellido materno</strong>,{' '}
                <strong className='text-amber-200'>teléfono</strong>,{' '}
                <strong className='text-amber-200'>dirección</strong> y agregar
                al menos{' '}
                <strong className='text-amber-200'>
                  un contacto de emergencia
                </strong>
                .
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
          <span>Volver al Inicio</span>
        </Link>
      )}

      <div>
        <h1 className='text-3xl font-bold text-white'>Mi Perfil</h1>
        <p className='text-gray-400 mt-2'>
          Administra tu información personal y contactos seguros.
        </p>
      </div>
    </div>
  )
}
