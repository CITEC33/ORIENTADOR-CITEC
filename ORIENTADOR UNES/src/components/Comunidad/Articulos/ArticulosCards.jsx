import { motion, AnimatePresence } from 'framer-motion'
import { ArticuloCard } from './ArticuloCard'
import { ArticuloCardExpandida } from './ArticuloCardExpandida'
import { useState } from 'react'
import { useArticulos } from '../../../hooks/useArticulos'
import { Loader2, BookOpen } from 'lucide-react'

export const ArticulosCards = () => {
  const { data: articulos, isLoading } = useArticulos()
  const [expandedArticulo, setExpandedModule] = useState(null)

  const toggleModule = (id) => {
    setExpandedModule(expandedArticulo === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500' />
      </div>
    )
  }

  if (!articulos || articulos.length === 0) {
    return (
      <div className='text-center py-20 text-gray-500'>
        <BookOpen className='w-12 h-12 mx-auto mb-3 opacity-20 text-gray-400' />
        <p>No hay artículos disponibles por el momento.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className='space-y-8'
    >
      {articulos.map((articulo) => (
        <div
          key={articulo.id}
          className='group bg-gray-900 rounded-[2rem] shadow-xl shadow-black/30 border border-gray-700 overflow-hidden transition-all hover:shadow-2xl hover:border-purple-500/40'
        >
          <button
            onClick={() => toggleModule(articulo.id)}
            className='w-full text-left flex flex-col md:flex-row'
          >
            <ArticuloCard
              articulo={articulo}
              expandedArticulo={expandedArticulo}
            />
          </button>

          <AnimatePresence>
            {expandedArticulo === articulo.id && (
              <ArticuloCardExpandida articulo={articulo} />
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  )
}
