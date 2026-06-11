import dayjs from 'dayjs'
import { Edit, Trash2, Clock, BookOpen, Lightbulb } from 'lucide-react'

export const Articulos = ({ filtered, onEdit, onDelete }) => {
  return filtered.length === 0 ? (
    <div className='text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-700'>
      <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700'>
        <BookOpen className='w-8 h-8 text-gray-600' />
      </div>
      <h3 className='text-white font-bold text-lg'>
        No hay artículos publicados
      </h3>
      <p className='text-gray-500 text-sm mt-1'>
        Empieza a crear contenido para tu biblioteca.
      </p>
    </div>
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
      {filtered.map((item) => (
        <div
          key={item.id}
          className='group relative bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-black/30 hover:border-purple-500/30 hover:-translate-y-1 flex flex-col justify-between h-full'
        >
          <div className='aspect-video w-full bg-gray-900 relative overflow-hidden'>
            <img
              src={item.imagen}
              alt={item.titulo}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100'
              onError={(e) => {
                e.target.src =
                  'https://placehold.co/600x400/1f2937/a78bfa?text=Sin+Imagen'
              }}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60'></div>

            <div className='absolute top-3 left-3'>
              <span className='inline-flex items-center gap-1 bg-gray-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-purple-400 border border-purple-500/30 shadow-lg max-w-[200px]'>
                <Lightbulb className='w-3 h-3 flex-shrink-0' />
                <span className='truncate'>{item.concepto_clave}</span>
              </span>
            </div>
          </div>

          <div className='p-6 flex flex-col flex-1'>
            <div className='mb-4 flex-1'>
              <h3 className='font-bold text-lg text-white leading-tight mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors'>
                {item.titulo}
              </h3>
              <p className='text-sm text-gray-400 line-clamp-3 leading-relaxed'>
                {item.descripcion}
              </p>
            </div>

            <div>
              <div className='flex items-center gap-2 text-xs text-gray-400 font-medium mb-4 pt-4 border-t border-gray-700'>
                <Clock className='w-3.5 h-3.5' />
                Publicado: {dayjs(item.created_at).format('D MMM YYYY')}
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
        </div>
      ))}
    </div>
  )
}
