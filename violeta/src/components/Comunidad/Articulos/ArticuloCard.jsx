import { ChevronUp } from 'lucide-react'

export const ArticuloCard = ({ articulo, expandedArticulo }) => {
  return (
    <>
      <div className='w-full md:w-48 h-48 md:h-auto bg-gray-800 relative shrink-0'>
        <img
          src={articulo.imagen}
          alt={articulo.titulo}
          className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100'
          onError={(e) => {
            e.target.src =
              'https://placehold.co/600x400/1f2937/a78bfa?text=Sin+Imagen'
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r md:from-gray-900/50 md:to-transparent' />
      </div>

      <div className='p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-center'>
        <h3 className='text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors'>
          {articulo.titulo}
        </h3>
        <p className='text-gray-400 leading-relaxed mb-6'>
          {articulo.descripcion}
        </p>

        <div className='mt-auto flex items-center gap-2 text-sm font-bold text-purple-400 justify-center md:justify-start'>
          <span className='border-b-2 border-transparent group-hover:border-purple-500 transition-all'>
            {expandedArticulo === articulo.id
              ? 'Cerrar contenido'
              : 'Explorar módulo'}
          </span>
          <div
            className={`p-1 rounded-full bg-purple-900/30 transition-transform duration-300 ${
              expandedArticulo === articulo.id ? 'rotate-180' : ''
            }`}
          >
            <ChevronUp className='w-4 h-4' />
          </div>
        </div>
      </div>
    </>
  )
}
