import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  ExternalLink,
  Clock,
  HeartPulseIcon
} from 'lucide-react'

export const OrgsDirectorioAyuda = forwardRef(({ org }) => {
  return (
    <motion.div
      key={org.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className='bg-gray-900 rounded-3xl p-1.5 shadow-md border border-gray-700 hover:border-purple-500/40 hover:shadow-lg transition-all flex flex-col sm:flex-row group overflow-hidden'
    >
      <div className='sm:w-56 h-40 bg-white sm:h-auto relative shrink-0 rounded-[1.25rem] overflow-hidden m-1'>
        <img
          src={org.image}
          alt={org.name}
          className='w-full h-full object-contain transition-transform rounded-[1.25rem] duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100'
        />
      </div>

      <div className='p-4 sm:py-3 sm:pr-5 flex-1 flex flex-col min-w-0'>
        {' '}
        <div className='flex justify-between items-start mb-1 gap-2'>
          <h3
            className='text-lg font-bold text-purple-300 leading-tight group-hover:text-purple-200 transition-colors truncate w-full'
            title={org.name}
          >
            {org.name}
          </h3>
        </div>
        <p
          className='text-gray-400 text-xs sm:text-sm leading-snug mb-3'
          title={org.description}
        >
          {org.description}
        </p>
        <div className='mt-auto space-y-3'>
          <div className='flex flex-wrap justify-between gap-2 text-xs text-gray-500 font-medium'>
            <div className='flex items-start gap-1.5 col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1'>
              <MapPin className='w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0' />
              <span
                className='break-words leading-tight text-gray-400'
                title={org.address}
              >
                {org.address}
              </span>
            </div>
            <div className='flex items-center gap-1.5 text-purple-400'>
              <Clock className='w-3.5 h-3.5 shrink-0' />
              <span className='truncate' title={org.hours}>
                {org.hours}
              </span>
            </div>
          </div>

          {org.linae_abierta && (
            <div>
              <p className='text-xs text-white font-bold bg-purple-400/20 px-2 py-1 rounded-lg inline-flex items-center gap-1'>
                <HeartPulseIcon className='w-3.5 h-3.5 text-purple-400' />
                Línea abierta 24/7
              </p>
            </div>
          )}

          <div className='sm:flex gap-3 pt-2 space-y-3 sm:space-y-0'>
            <a
              href={`tel:${org.phone.replace(/\s/g, '')}`}
              className='flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-500 transition-all shadow-md hover:shadow-lg active:scale-95'
            >
              <Phone className='w-3.5 h-3.5' /> Llamar
            </a>
            <a
              href={org.URL}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-800 border border-gray-600 text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-all active:scale-95'
            >
              <ExternalLink className='w-3.5 h-3.5' /> Ver Mapa
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
})
