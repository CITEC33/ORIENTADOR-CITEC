import { motion } from 'framer-motion'
import { Lightbulb, BookOpen } from 'lucide-react'

export const ArticuloCardExpandida = ({ articulo }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='overflow-hidden border-t border-gray-700 bg-gray-800/30'
    >
      <div className='p-3 sm:p-6 md:p-10'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <div className='relative bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg shadow-black/20 border border-purple-500/20 overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none'></div>

            <div className='relative flex flex-col sm:flex-row gap-5 items-center sm:items-start'>
              <div className='shrink-0 p-3.5 bg-purple-900/30 text-purple-400 rounded-xl shadow-sm ring-1 ring-purple-500/30'>
                <Lightbulb className='w-6 h-6' strokeWidth={2.5} />
              </div>

              <div className='space-y-2'>
                <h4 className='text-xs font-black uppercase tracking-widest text-purple-400/80 flex items-center gap-2'>
                  <span className='w-8 h-[2px] bg-purple-500/50 rounded-full'></span>
                  Concepto Clave
                </h4>
                <p className='tex-sm sm:text-xl text-white font-semibold leading-relaxed'>
                  {articulo.concepto_clave}
                </p>
              </div>
            </div>
          </div>

          <div className='px-2 md:px-4'>
            <h4 className='flex items-center gap-3 text-lg font-bold text-white mb-6'>
              <div className='p-1.5 bg-gray-700 rounded-lg text-gray-300'>
                <BookOpen className='w-4 h-4' />
              </div>
              Contenido principal
            </h4>

            <div className='text-gray-300 whitespace-pre-wrap font-normal leading-relaxed text-sm sm:text-base'>
              {articulo.contenido}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
