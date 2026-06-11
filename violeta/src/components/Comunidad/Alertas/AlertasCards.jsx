import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Clock } from 'lucide-react'
import { useAlertas } from '../../../hooks/useAlertas'
import {
  getCategoryStyles,
  getPriorityConfig
} from '../../../lib/alertasStyles'
import dayjs from 'dayjs'

export const AlertasCards = () => {
  const { data: alertas, isLoading } = useAlertas()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500' />
      </div>
    )
  }

  const filteredAlerta = (alertas || []).filter((res) => {
    const matchesSearch =
      res.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <>
      <div className='justify-between items-center'>
        <div className='relative w-full group'>
          <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
            <Search className='text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors' />
          </div>
          <input
            type='text'
            placeholder='Buscar alertas, avisos o comunicados...'
            className='w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-600 bg-gray-900 text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all text-sm placeholder-gray-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.div layout className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <AnimatePresence>
          {filteredAlerta.map((alerta) => {
            const config = getPriorityConfig(alerta.prioridad)
            const style = getCategoryStyles(config.color)
            const Icon = config.icon

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={alerta.id}
                className={`group bg-gray-900 rounded-[1.5rem] p-1 border-2 ${style.border} shadow-lg shadow-black/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col`}
              >
                <div className='flex flex-col h-full p-4 rounded-[1.25rem] bg-gray-900 group-hover:bg-gray-800 transition-colors'>
                  <div className='flex justify-between items-start mb-4'>
                    <div
                      className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center ${style.text} shadow-inner group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}
                    >
                      <Icon className='w-6 h-6' />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${style.badge}`}
                    >
                      {alerta.prioridad}
                    </span>
                  </div>

                  <h3 className='text-lg font-bold text-white mb-2 leading-tight transition-colors'>
                    {alerta.titulo}
                  </h3>
                  <p className='text-gray-400 text-sm mb-6 flex-1 leading-relaxed'>
                    {alerta.descripcion}
                  </p>

                  <div className='pt-4 mt-auto border-t border-gray-700 flex items-center gap-1'>
                    <span className='text-xs font-semibold text-gray-500'>
                      <Clock className='w-3 h-3' />
                    </span>
                    <span className='text-xs font-semibold text-gray-500'>
                      Publicado el{' '}
                      {dayjs(alerta.created_at).format(
                        'DD [de] MMMM [a las] hh:mm A'
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filteredAlerta.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-20'
        >
          <div className='w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600 border border-gray-700'>
            <Search className='w-8 h-8' />
          </div>
          <h3 className='text-lg font-bold text-gray-300'>
            No se encontraron alertas
          </h3>
          <p className='text-gray-500'>
            Intenta con otra búsqueda o verifica más tarde.
          </p>
        </motion.div>
      )}
    </>
  )
}
