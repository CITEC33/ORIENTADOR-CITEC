import { motion } from 'framer-motion'
import { Activity, MessageCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PanicButton } from '../components/PanicButton'
import { useEffect, useState } from 'react'
import video from '../assets/imgs/violeta-avatar.mp4'
import poster from '../assets/imgs/avatar-violeta.jpeg'

const HomePage = ({ handleModal, setMessage, message }) => {
  useEffect(() => {
    document.title = 'Fuerza Violeta'
  }, [])

  return (
    <div className='flex items-center justify-center p-4 sm:p-4 overflow-y-auto'>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='max-w-lg w-full bg-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-4 sm:px-8 border border-gray-700'
      >
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 hover:rotate-0 transition-transform duration-300 border border-purple-500/20'>
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              poster={poster}
              className='w-full h-full object-cover rounded-2xl will-change-transform'
              aria-label='Violeta avatar animado'
              style={{ objectPosition: 'center center' }}
            />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
            Hola, soy Violeta
          </h1>
          <p className='text-gray-400 leading-relaxed text-sm'>
            Tu espacio seguro. Estoy aquí para escucharte y orientarte. <br />{' '}
            ¿Cómo podemos ayudarte hoy?
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 mb-4'>
          <Link
            to='/chat'
            className='group relative w-full py-4 px-6 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-900/50 transition-all flex items-center justify-between overflow-hidden'
          >
            <div className='flex items-center gap-4 z-10'>
              <div className='bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors'>
                <MessageCircle className='w-6 h-6' />
              </div>
              <div className='text-left'>
                <div className='text-lg leading-tight'>
                  Platicar con Violeta
                </div>
                <div className='text-xs opacity-80 font-medium'>
                  Asistente IA confidencial
                </div>
              </div>
            </div>
            <ArrowLeft className='w-5 h-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0' />
          </Link>

          <Link
            to='/violentometro'
            className='group w-full py-4 px-6 bg-gray-900 border-2 border-gray-700 text-gray-300 rounded-xl font-bold hover:border-purple-500/50 hover:text-purple-300 hover:bg-gray-800 transition-all flex items-center justify-between'
          >
            <div className='flex items-center gap-4'>
              <div className='bg-gray-800 p-2 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors'>
                <Activity className='w-6 h-6' />
              </div>
              <div className='text-left'>
                <div className='text-lg leading-tight'>Evaluar mi riesgo</div>
                <div className='text-xs text-gray-400 font-medium group-hover:text-purple-400/70'>
                  Test del Violentómetro
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className='border-t border-gray-700 pt-4'>
          <p className='text-xs font-bold text-gray-200 uppercase tracking-widest text-center mb-4'>
            Zona de Ayuda Inmediata
          </p>
          <div>
            <PanicButton handleModal={handleModal} setMessage={setMessage} />
          </div>
        </div>
        <p className='text-xs text-gray-400 text-center mt-5'>
          Powered by CITEC
        </p>
      </motion.div>
    </div>
  )
}
export default HomePage
