import { motion } from 'framer-motion'
import { Clock, MapPin, Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useEventos } from '../../../hooks/useEventos'

dayjs.locale('es')

export const SeccionEventosComunidad = () => {
  const { eventos, isLoading } = useEventos()

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-500' />
      </div>
    )
  }

  return eventos.length === 0 ? (
    <p className='text-center text-gray-500'>No hay eventos próximos.</p>
  ) : (
    eventos.map((evento) => {
      const fecha = dayjs(evento.fecha_hora)

      return (
        <motion.div
          key={evento.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='bg-gray-900 p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row gap-6 items-start shadow-md hover:border-purple-500/30 transition-colors'
        >
          <div className='flex flex-col items-center justify-center mx-auto bg-gray-800 border border-gray-600 rounded-xl p-4 min-w-[90px]'>
            <span className='text-2xl font-black text-purple-400'>
              {fecha.format('DD')}
            </span>
            <span className='text-[10px] uppercase font-bold text-gray-400'>
              {fecha.format('MMM').replace('.', '')}
            </span>
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-bold text-white mb-2'>
              {evento.titulo}
            </h3>
            <div className='flex flex-wrap gap-4 text-xs text-gray-400 font-medium mb-4'>
              <span className='flex items-center gap-1'>
                <Clock className='w-3 h-3 text-purple-400' />
                {fecha.format('hh:mm A')}
              </span>
              <span className='flex items-center gap-1'>
                <MapPin className='w-3 h-3 text-purple-400' /> {evento.lugar}
              </span>
            </div>
            <p className='text-sm text-gray-300 mb-4 leading-relaxed'>
              {evento.descripcion}
            </p>
          </div>
        </motion.div>
      )
    })
  )
}
