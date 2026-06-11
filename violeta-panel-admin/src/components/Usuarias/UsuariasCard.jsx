import { Eye, MapPin, Phone, ShieldAlert, Users } from 'lucide-react'
import { UserAvatar } from './UserAvatar'

export const UsuariasCard = ({ filtered, users, onSelectUser }) => {
  return filtered.length === 0 ? (
    <div className='text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-700'>
      <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700'>
        <Users className='w-8 h-8 text-gray-600' />
      </div>
      <h3 className='text-white font-bold text-lg'>Sin resultados</h3>
      <p className='text-gray-500 text-sm mt-1'>
        {users.length === 0
          ? 'Aún no hay usuarias registradas en la plataforma.'
          : 'No se encontraron coincidencias con tu búsqueda.'}
      </p>
    </div>
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
      {filtered.map((user) => (
        <div
          key={user.id}
          className='group bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:shadow-xl hover:shadow-black/30 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col'
        >
          <div className='text-center mb-6'>
            <UserAvatar
              user={user}
              size='lg'
              className='ring-4 ring-gray-900 mx-auto mb-4 shadow-lg'
            />
            <div className='min-w-0'>
              <h3 className='font-bold text-lg text-white truncate leading-tight group-hover:text-purple-300 transition-colors'>
                {user.nombre_completo} {user?.apellido_p} {user?.apellido_m}
              </h3>
            </div>
          </div>

          <div className='space-y-3 mb-6 flex-1'>
            {user.telefono ? (
              <div className='flex items-center gap-3 text-sm text-gray-300 bg-gray-900 p-2.5 rounded-xl border border-gray-700'>
                <div className='p-1.5 bg-gray-800 rounded-lg shadow-sm text-purple-400'>
                  <Phone className='w-3.5 h-3.5' />
                </div>
                <span className='font-mono font-medium'>{user.telefono}</span>
              </div>
            ) : (
              <div className='text-sm text-gray-500 italic px-2'>
                Sin teléfono registrado
              </div>
            )}

            {user.direccion ? (
              <div className='flex items-center gap-3 text-sm text-gray-300 bg-gray-900 p-2.5 rounded-xl border border-gray-700'>
                <div className='p-1.5 bg-gray-800 rounded-lg shadow-sm mt-0.5 text-purple-400'>
                  <MapPin className='w-3.5 h-3.5' />
                </div>
                <span className='line-clamp-2 leading-relaxed'>
                  {user.direccion}
                </span>
              </div>
            ) : (
              <div className='text-sm text-gray-500 italic px-2'>
                Sin dirección registrada
              </div>
            )}

            <div className='flex items-center gap-3 text-sm text-gray-300 bg-gray-900 p-2.5 rounded-xl border border-gray-700'>
              <div className='p-2 bg-gray-800 rounded-lg shadow-sm mt-0.5 text-purple-400'>
                {user.contactos?.length || 0}
              </div>
              <span>Contacto(s) de emergencia registrado(s)</span>
            </div>
          </div>

          <hr className='h-[2px] w-full bg-gray-700 border-0' />

          <div className='mt-6 flex justify-center'>
            <button
              onClick={() => onSelectUser(user)}
              className='flex items-center gap-2 px-4 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/30'
            >
              <Eye className='w-5 h-5 shrink-0' />
              Ver expediente
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
