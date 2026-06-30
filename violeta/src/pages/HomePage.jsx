import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  GraduationCap,
  Info,
  MessageCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PanicButton } from '../components/PanicButton'
import { useEffect } from 'react'
import video from '../assets/imgs/violeta-avatar.mp4'
import poster from '../assets/imgs/violeta-orienta-avatar.png'
import campus from '../assets/imgs/campus-unes.jpg'

const HomePage = ({ handleModal, setMessage }) => {
  useEffect(() => {
    document.title = 'UNES Orienta IA'
  }, [])

  return (
    <div className='flex items-center justify-center p-4 sm:p-4 overflow-y-auto'>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='max-w-lg w-full bg-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-4 sm:px-8 border border-gray-700 overflow-hidden'
      >
        <div className='-mx-4 sm:-mx-8 -mt-4 mb-6 h-32 relative'>
          <img
            src={campus}
            alt='Campus Universidad Espana Durango'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/35 to-transparent' />
        </div>

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
              aria-label='Violeta orientadora avatar animado'
              style={{ objectPosition: 'center center' }}
            />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
            UNES Orienta IA
          </h1>
          <p className='text-gray-400 leading-relaxed text-sm'>
            Descubre tu carrera ideal en Universidad Espana Durango con ayuda
            de inteligencia artificial.
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
                <div className='text-lg leading-tight'>Hablar con Violeta</div>
                <div className='text-xs opacity-80 font-medium'>
                  Asistente vocacional de Universidad Espana Durango
                </div>
              </div>
            </div>
            <ArrowLeft className='w-5 h-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0' />
          </Link>

          <Link
            to='/carreras-unes'
            className='group w-full py-4 px-6 bg-gray-900 border-2 border-gray-700 text-gray-300 rounded-xl font-bold hover:border-purple-500/50 hover:text-purple-300 hover:bg-gray-800 transition-all flex items-center justify-between'
          >
            <div className='flex items-center gap-4'>
              <div className='bg-gray-800 p-2 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors'>
                <GraduationCap className='w-6 h-6' />
              </div>
              <div className='text-left'>
                <div className='text-lg leading-tight'>Ver carreras UNES</div>
                <div className='text-xs text-gray-400 font-medium group-hover:text-purple-400/70'>
                  Oferta academica por areas
                </div>
              </div>
            </div>
          </Link>

          <Link
            to='/chat'
            className='group w-full py-4 px-6 bg-gray-900 border-2 border-gray-700 text-gray-300 rounded-xl font-bold hover:border-blue-500/50 hover:text-blue-300 hover:bg-gray-800 transition-all flex items-center justify-between'
          >
            <div className='flex items-center gap-4'>
              <div className='bg-gray-800 p-2 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors'>
                <Brain className='w-6 h-6' />
              </div>
              <div className='text-left'>
                <div className='text-lg leading-tight'>
                  Descubrir mi perfil vocacional
                </div>
                <div className='text-xs text-gray-400 font-medium group-hover:text-blue-400/70'>
                  Intereses, habilidades y proyecto de vida
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className='border-t border-gray-700 pt-4'>
          <p className='text-xs font-bold text-gray-200 uppercase tracking-widest text-center mb-4'>
            Admisiones UNES
          </p>
          <PanicButton handleModal={handleModal} setMessage={setMessage} />
        </div>

        <Link
          to='/vida-unes'
          className='mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-purple-200 hover:text-white transition-colors'
        >
          <Info className='w-4 h-4' />
          Solicitar informacion y recursos UNES
        </Link>

        <p className='text-xs text-gray-400 text-center mt-5'>
          Universidad Espana Durango
        </p>
      </motion.div>
    </div>
  )
}
export default HomePage
