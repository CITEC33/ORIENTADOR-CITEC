import { motion } from 'framer-motion'
import { Activity, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

export const HeaderViolentometro = () => {
  return (
    <div className='bg-gradient-to-b from-purple-900 to-gray-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl shadow-black/50 relative overflow-hidden'>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className='max-w-5xl mx-auto text-center relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex justify-center items-center mb-6 gap-3 flex-col sm:flex-row'>
            <div className='w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20'>
              <Activity className='w-10 h-10 text-purple-300' />
            </div>
            <h1 className='text-4xl md:text-6xl font-black tracking-tight text-white'>
              Violentómetro
            </h1>
          </div>
          <p className='text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8'>
            Una herramienta para detectar el nivel de violencia en tus
            relaciones. <br />
            <span className='text-lg font-bold text-red-400 drop-shadow-md'>
              No es normal, es violencia.
            </span>
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='#test'
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('test')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
                history.replaceState(null, '', '#test')
              }}
              className='bg-white text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2'
            >
              <Activity className='w-5 h-5' />
              Iniciar diagnóstico
            </a>
            <Link
              to='/comunidad'
              className='bg-gray-800/50 backdrop-blur-md border border-gray-600 text-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-700/50 hover:text-white transition-all flex items-center justify-center gap-2'
            >
              <ShieldAlert className='w-5 h-5' />
              Ir a la comunidad
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
