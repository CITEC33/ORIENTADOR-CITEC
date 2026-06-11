import dayjs from 'dayjs'
import { ShieldCheck, Mail, Edit, Trash2 } from 'lucide-react'

export const Admins = ({ filtered, openEditModal, handleDelete }) => {
  return filtered.length === 0 ? (
    <div className='text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-700'>
      <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700'>
        <ShieldCheck className='w-8 h-8 text-gray-600' />
      </div>
      <h3 className='text-white font-bold text-lg'>Sin administradores</h3>
      <p className='text-gray-500 text-sm mt-1'>
        No se encontraron registros que coincidan.
      </p>
    </div>
  ) : (
    <div className='bg-gray-800 rounded-3xl border border-gray-700 shadow-xl shadow-black/20 overflow-hidden overflow-x-auto'>
      <table className='w-full text-left border-collapse min-w-[800px]'>
        <thead>
          <tr className='bg-gray-900 border-b border-gray-700 text-center'>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Administrador
            </th>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Contacto
            </th>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Fecha de Alta
            </th>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest text-right'>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-700'>
          {filtered.map((admin) => (
            <tr
              key={admin.id}
              className='group hover:bg-gray-700/30 transition-colors'
            >
              <td className='px-6 py-4'>
                <div className='flex items-center justify-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-bold border border-purple-500/30 shadow-sm shrink-0'>
                    {admin.nombre_completo?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className='font-bold text-white whitespace-nowrap'>
                      {admin.nombre_completo || 'Sin nombre'}
                    </div>
                    <div className='text-sm bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full inline-block mt-1 font-mono border border-gray-700'>
                      ID: {admin.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              </td>
              <td className='px-6 py-4'>
                <div className='flex items-center justify-center gap-2 text-gray-300 font-medium'>
                  <Mail className='w-5 h-5 text-gray-500 shrink-0' />
                  <span className='truncate max-w-[200px]'>{admin.correo}</span>
                </div>
              </td>
              <td className='px-6 py-4 text-center'>
                <div className='text-gray-400 font-medium whitespace-nowrap'>
                  {dayjs(admin.fecha_registro).format('DD [de] MMMM [de] YYYY')}
                </div>
                <div className='text-gray-400'>
                  {dayjs(admin.fecha_registro).format('hh:mm A')}
                </div>
              </td>
              <td className='px-6 py-4 text-right'>
                <div className='flex items-center justify-end gap-2'>
                  <button
                    onClick={() => openEditModal(admin)}
                    className='p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-colors border border-transparent hover:border-emerald-500/30'
                    title='Editar nombre'
                  >
                    <Edit className='w-6 h-6' />
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30'
                    title='Revocar acceso'
                  >
                    <Trash2 className='w-6 h-6' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
