import { motion } from 'framer-motion'
import {
  Briefcase,
  GraduationCap,
  MessageCircle,
  Send,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { unesCareerAreas, unesCareerCount } from '../data/unesCareers'
import careersBg from '../assets/imgs/careers-bg.jpg'

const CarrerasPage = () => {
  useEffect(() => {
    document.title = 'Carreras UNES - UNES Orienta IA'
  }, [])

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto'>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-6xl mx-auto'
      >
        <div className='mb-8 text-center rounded-3xl overflow-hidden border border-gray-700 bg-gray-800 shadow-xl shadow-black/20'>
          <div className='h-44 relative'>
            <img
              src={careersBg}
              alt='Carreras Universidad Espana Durango'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/45 to-transparent' />
            <div className='absolute inset-x-0 bottom-5 px-5'>
              <div className='w-16 h-16 bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30 shadow-lg shadow-purple-900/30'>
                <GraduationCap className='w-9 h-9 text-purple-200' />
              </div>
            </div>
          </div>
          <div className='px-5 pb-8'>
            <p className='text-purple-300 text-sm font-bold uppercase tracking-[0.25em] mb-2'>
              UNES Orienta IA
            </p>
            <h1 className='text-3xl sm:text-4xl font-black text-white mb-3'>
              Carreras UNES
            </h1>
            <p className='text-gray-300 max-w-3xl mx-auto leading-relaxed'>
              Explora la oferta academica de Universidad Espana Durango y
              conversa con Violeta para descubrir que carrera conecta mejor con
              tus intereses, habilidades y proyecto de vida.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
          <div className='bg-gray-800/80 border border-gray-700 rounded-2xl p-5 text-center'>
            <Sparkles className='w-7 h-7 text-purple-300 mx-auto mb-2' />
            <p className='text-3xl font-black text-white'>
              {unesCareerAreas.length}
            </p>
            <p className='text-xs uppercase tracking-widest text-gray-400'>
              Areas academicas
            </p>
          </div>
          <div className='bg-gray-800/80 border border-gray-700 rounded-2xl p-5 text-center'>
            <Briefcase className='w-7 h-7 text-purple-300 mx-auto mb-2' />
            <p className='text-3xl font-black text-white'>{unesCareerCount}</p>
            <p className='text-xs uppercase tracking-widest text-gray-400'>
              Carreras listadas
            </p>
          </div>
          <div className='bg-gray-800/80 border border-gray-700 rounded-2xl p-5 text-center'>
            <GraduationCap className='w-7 h-7 text-purple-300 mx-auto mb-2' />
            <p className='text-3xl font-black text-white'>IA</p>
            <p className='text-xs uppercase tracking-widest text-gray-400'>
              Orientacion vocacional
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {unesCareerAreas.map((area) => (
            <motion.article
              key={area.area}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-gray-800/90 rounded-3xl border border-gray-700 p-5 shadow-xl shadow-black/20 hover:border-purple-500/40 transition-all flex flex-col'
            >
              <h2 className='text-xl font-bold text-white mb-2'>
                {area.area}
              </h2>
              <p className='text-sm text-gray-400 leading-relaxed mb-4'>
                {area.description}
              </p>
              <div className='space-y-2 mb-5 flex-1'>
                {area.careers.map((career) => (
                  <div
                    key={career}
                    className='px-3 py-2 rounded-xl bg-gray-900/80 border border-gray-700 text-sm text-gray-200'
                  >
                    {career}
                  </div>
                ))}
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <Link
                  to='/chat'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-purple-500 transition-colors'
                >
                  <MessageCircle className='w-4 h-4' />
                  Preguntar a Violeta
                </Link>
                <Link
                  to='/chat'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-bold text-blue-200 border border-blue-500/40 hover:bg-blue-950/40 transition-colors'
                >
                  <Send className='w-4 h-4' />
                  Solicitar informacion
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default CarrerasPage
