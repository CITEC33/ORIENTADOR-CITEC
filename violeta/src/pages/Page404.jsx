import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, GraduationCap, Home, MessageCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function Page404() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Pagina no encontrada - UNES Orienta IA'
  }, [])

  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-100'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px]'
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          className='absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]'
        />
      </div>

      <div className='relative z-10 w-full max-w-lg text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-8 relative inline-block'
        >
          <div className='w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20 shadow-2xl'>
            <GraduationCap className='w-14 h-14 text-violet-300' />
          </div>
          <div className='absolute -bottom-2 -right-2 bg-white text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg'>
            404
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='space-y-6'
        >
          <div className='space-y-2'>
            <h1 className='text-4xl font-black bg-gradient-to-r from-white via-violet-200 to-blue-300 bg-clip-text text-transparent'>
              Pagina no encontrada
            </h1>
            <p className='text-slate-400 leading-relaxed max-w-sm mx-auto'>
              No encontramos esa ruta, pero Violeta puede ayudarte a volver a
              carreras, admisiones u orientacion vocacional.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/'
              className='flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 hover:scale-105 transition-transform'
            >
              <Home className='w-5 h-5' />
              Volver al inicio
            </Link>

            <button
              onClick={() => navigate(-1)}
              className='flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white border border-white/10 rounded-xl font-bold hover:bg-white/20 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              Regresar
            </button>
          </div>

          <div className='pt-8 border-t border-white/10 mt-8'>
            <p className='text-slate-400 text-sm mb-3'>
              Necesitas orientacion?
            </p>
            <Link
              to='/chat'
              className='inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-bold bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 transition-colors'
            >
              <MessageCircle className='w-4 h-4' />
              Hablar con Violeta
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
