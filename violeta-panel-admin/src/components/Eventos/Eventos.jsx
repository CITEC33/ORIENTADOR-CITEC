import dayjs from 'dayjs'
import { Calendar, Edit, MapPin, Megaphone, Trash2, Clock } from 'lucide-react'

export const Eventos = ({ filtered, onEdit, onDelete }) => {
  return filtered.length === 0 ? (
    <div className='text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-700'>
      <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700'>
        <Calendar className='w-8 h-8 text-gray-600' />
      </div>
      <h3 className='text-white font-bold text-lg'>
        No hay eventos programados
      </h3>
      <p className='text-gray-500 text-sm mt-1'>
        Crea el primer evento para informar a la comunidad.
      </p>
    </div>
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {filtered.map((item) => {
        const isExpired =
          item.fecha_expiracion && new Date(item.fecha_expiracion) < new Date()

        return (
          <div
            key={item.id}
            className='group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-black/30 hover:border-purple-500/30 hover:-translate-y-1 flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2.5 rounded-xl bg-purple-900/30 text-purple-400 border border-purple-500/20'>
                  <Calendar className='w-5 h-5' />
                </div>
                <span className='flex items-center gap-1 text-[10px] uppercase font-black px-2 py-1 rounded-md bg-gray-900 text-gray-400 border border-gray-700'>
                  <MapPin className='w-3 h-3' />
                  {item.lugar || 'Ubicación pendiente'}
                </span>
              </div>

              <div className='mb-6 space-y-2'>
                <h3 className='font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors'>
                  {item.titulo}
                </h3>
                <p className='text-sm text-gray-400 line-clamp-3 leading-relaxed'>
                  {item.descripcion}
                </p>
              </div>
            </div>

            <div>
              <div className='flex flex-col gap-2 text-xs text-gray-500 font-medium border-t border-gray-700 pt-4 mb-4'>
                <div className='flex items-center gap-2 text-purple-400 font-bold'>
                  <Clock className='w-3.5 h-3.5' />
                  {dayjs(item.fecha_hora).format('dddd D [de] MMMM, hh:mm A')}
                </div>

                {item.fecha_expiracion && (
                  <div
                    className={`flex items-center gap-2 ${isExpired ? 'text-red-400' : 'text-gray-500'}`}
                  >
                    <Megaphone className='w-3.5 h-3.5' />
                    {isExpired
                      ? 'Evento finalizado'
                      : `Visible hasta: ${dayjs(item.fecha_expiracion).format('D MMM')}`}
                  </div>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={() => onEdit(item)}
                  className='flex-1 py-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-bold border border-gray-700 hover:border-emerald-500/30'
                >
                  <Edit className='w-3.5 h-3.5' />
                  Editar
                </button>

                <div className='w-px h-4 bg-gray-700'></div>

                <button
                  onClick={() => onDelete(item.id)}
                  className='flex-1 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-bold border border-gray-700 hover:border-red-500/30'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
