import { motion } from 'framer-motion'
import { LoginForm } from '../components/Auth/LoginForm'
import { useEffect } from 'react'
import logo_durango from '../assets/imgs/logo_durango.png'
import logo from '../assets/imgs/avatar-violeta.jpeg'

export default function Login() {
  useEffect(() => {
    document.title = 'Iniciar sesión | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-violet-500/30 text-slate-100'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute -top-[30%] -left-[10%] w-[900px] h-[900px] bg-violet-900/20 rounded-full blur-[120px]'
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className='absolute -bottom-[20%] -right-[10%] w-[700px] h-[700px] bg-blue-900/10 rounded-full blur-[100px]'
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative z-10 w-full max-w-md'
      >
        <div className='bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden relative border border-white/10'>
          <div className='h-1.5 w-full bg-gradient-to-r from-slate-700 via-violet-600 to-slate-700'></div>

          <div className='p-8 md:p-10'>
            <div className='text-center mb-8'>
              <div className='flex items-center justify-center gap-5 mb-6'>
                <img
                  src={logo_durango}
                  alt='Gobierno'
                  className='h-16 w-auto object-contain mix-blend-multiply'
                />

                <div className='h-12 w-px bg-slate-200'></div>

                <div className='w-16 h-16 rounded-2xl shadow-lg shadow-purple-900/40 shrink-0'>
                  <img
                    src={logo}
                    alt='Violeta Logo'
                    className='w-full h-full rounded-2xl object-cover shrink-0'
                  />
                </div>
              </div>

              <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
                Panel Administrativo
              </h1>

              <div className='flex items-center justify-center gap-2 mt-2'>
                <p className='text-xs font-mono text-slate-500 uppercase tracking-widest'>
                  Bienvenido de nuevo
                </p>
              </div>
            </div>

            <LoginForm />
          </div>

          <div className='bg-slate-50 border-t border-slate-100 p-4 text-center'>
            <p className='text-[10px] text-slate-400 uppercase tracking-widest font-semibold'>
              Acceso Restringido • Solo Personal Autorizado
            </p>
            <p className='text-[10px] text-slate-400 mt-1'>
              Dirección Municipal de Seguridad Pública
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
