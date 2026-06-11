import { MapPin, Phone } from 'lucide-react'

export const ContactoUsuaria = ({ user }) => {
  return (
    <div className='space-y-3'>
      <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest ml-1'>
        Contacto Personal
      </h3>
      <div className='bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden'>
        {user.telefono ? (
          <div className='flex items-center gap-3 p-4 border-b border-gray-700'>
            <div className='p-2 bg-purple-900/30 rounded-lg text-purple-400'>
              <Phone size={18} />
            </div>
            <div>
              <p className='text-xs font-bold text-gray-400 uppercase'>
                Teléfono Móvil
              </p>
              <p className='font-mono text-sm font-semibold text-gray-200'>
                {user.telefono}
              </p>
            </div>
          </div>
        ) : (
          <div className='p-4 text-sm text-gray-500 italic'>
            Sin teléfono registrado
          </div>
        )}

        {user.direccion ? (
          <div className='flex items-center gap-3 p-4'>
            <div className='p-2 bg-purple-900/30 rounded-lg text-purple-400'>
              <MapPin size={18} />
            </div>
            <div>
              <p className='text-xs font-bold text-gray-400 uppercase'>
                Domicilio
              </p>
              <p className='text-sm font-semibold text-gray-200 leading-snug'>
                {user.direccion}
              </p>
            </div>
          </div>
        ) : (
          <div className='p-4 text-sm text-gray-500 italic border-t border-gray-700'>
            Sin dirección registrada
          </div>
        )}
      </div>
    </div>
  )
}
