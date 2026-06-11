import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Brain,
  DollarSign,
  Wifi,
  Hand,
  Heart
} from 'lucide-react'
import { VIOLENCE_TYPES_INFO } from '../../lib/violentometro-data'

const iconMap = {
  Brain: Brain,
  DollarSign: DollarSign,
  Wifi: Wifi,
  Hand: Hand,
  Heart: Heart
}

export const TiposViolenciaAccordion = () => {
  const [openId, setOpenId] = useState(null)

  const toggleSection = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className='space-y-4'>
      {VIOLENCE_TYPES_INFO.map((type) => {
        const Icon = iconMap[type.icon]
        const isOpen = openId === type.id

        return (
          <div
            key={type.id}
            className={`border rounded-xl transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-gray-800'
                : 'border-gray-700 bg-gray-800 hover:bg-gray-750 hover:border-gray-600'
            }`}
          >
            <button
              onClick={() => toggleSection(type.id)}
              className='w-full p-4 flex items-center justify-between text-left focus:outline-none'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={`p-2 rounded-lg ${isOpen ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-400'}`}
                >
                  <Icon className='w-6 h-6' />
                </div>
                <h3
                  className={`font-bold sm:text-lg ${isOpen ? 'text-purple-400' : 'text-gray-200'}`}
                >
                  {type.title}
                </h3>
              </div>
              {isOpen ? (
                <ChevronUp className='w-5 h-5 text-gray-500' />
              ) : (
                <ChevronDown className='w-5 h-5 text-gray-500' />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className='px-6 pb-6 pt-2 border-t border-gray-700 bg-black/20'>
                    <p className='text-gray-300 mb-4 leading-relaxed'>
                      {type.definition}
                    </p>

                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        <h4 className='font-bold text-gray-400 text-sm mb-2 uppercase tracking-wide'>
                          Ejemplos Reales:
                        </h4>
                        <ul className='space-y-2'>
                          {type.examples.map((ex, i) => (
                            <li
                              key={i}
                              className='flex items-start gap-2 text-sm text-gray-400'
                            >
                              <span className='w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_5px_rgba(239,68,68,0.8)]' />
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className='space-y-4'>
                        <div>
                          <h4 className='font-bold text-gray-400 text-sm mb-2 uppercase tracking-wide'>
                            Señales de Alerta:
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {type.signs.map((sign, i) => (
                              <span
                                key={i}
                                className='text-xs font-medium bg-amber-900/30 text-amber-400 px-2 py-1 rounded-md border border-amber-700/50'
                              >
                                {sign}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className='font-bold text-gray-400 text-sm mb-2 uppercase tracking-wide'>
                            Impacto:
                          </h4>
                          <p className='text-sm text-gray-400 italic border-l-2 border-purple-500 pl-3'>
                            {type.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
