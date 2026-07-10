import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useGuiasBienestar } from '../../../hooks/useGuiasBienestar'

export const GuiasBienestar = () => {
  const { guides } = useGuiasBienestar()
  const [activeGuide, setActiveGuide] = useState(null)

  const toggleGuide = (id) => setActiveGuide(activeGuide === id ? null : id)

  return (
    <div className='grid grid-cols-1 gap-6 items-start'>
      {guides.map((guide) => (
        <motion.div
          key={guide.id}
          layout='position'
          className={`bg-gray-900 rounded-md border transition-all duration-300 overflow-hidden shadow-md ${
            activeGuide === guide.id
              ? `${guide.ringColor} border-transparent ring-2`
              : 'hover:shadow-xl hover:border-gray-600 border-gray-700'
          }`}
        >
          <button
            onClick={() => toggleGuide(guide.id)}
            className='w-full text-left p-4 sm:p-6 focus:outline-none'
          >
            <div className='flex items-start justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <div className={`p-3.5 rounded-2xl border ${guide.color}`}>
                  <guide.icon className='w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-bold text-white text-lg leading-tight'>
                    {guide.title}
                  </h3>
                  <p className='text-xs text-gray-400 mt-1 font-medium'>
                    {guide.desc}
                  </p>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${activeGuide === guide.id ? 'bg-gray-700 rotate-180' : 'bg-gray-800'}`}
              >
                <ChevronDown className='w-4 h-4 text-gray-400' />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {activeGuide === guide.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-black/30 border-t border-gray-700'
              >
                <div className='p-4 sm:p-6 pt-2'>
                  <div className='mt-4'>{guide.content}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
