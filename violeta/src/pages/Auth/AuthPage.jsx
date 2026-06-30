import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, MessageCircle } from 'lucide-react'
import { Login } from '../../components/Auth/Login'
import { useEffect, useState } from 'react'
import Register from '../../components/Auth/Register'

import logoUnes from '../../assets/imgs/logo-unes.png'
import avatar from '../../assets/imgs/violeta-orienta-avatar.png'

const AuthPage = () => {
  const [page, setPage] = useState('login')

  useEffect(() => {
    document.title =
      page === 'login'
        ? 'Iniciar sesion - UNES Orienta IA'
        : 'Registrarse - UNES Orienta IA'
  }, [page])

  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-violet-500/30 text-slate-100'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className='absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[80px] will-change-transform transform-gpu'
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
            delay: 1
          }}
          className='absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[80px] will-change-transform transform-gpu'
        />
      </div>

      <div className='relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='hidden lg:block space-y-12'
        >
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
              <div className='w-24 h-16 rounded-md shadow-2xl overflow-hidden'>
                <img
                  src={logoUnes}
                  alt='Universidad Espana Durango'
                  className='w-full h-full object-cover rounded-md'
                />
              </div>

              <div className='w-16 h-16 rounded-2xl shadow-2xl overflow-hidden'>
                <img
                  src={avatar}
                  alt='Violeta orientadora'
                  className='w-full h-full rounded-2xl object-cover shrink-0'
                />
              </div>
            </div>

            <div className='h-20 w-px bg-gradient-to-b from-transparent via-violet-400/50 to-transparent'></div>

            <div>
              <h1 className='text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-violet-200 to-blue-300 bg-clip-text text-transparent'>
                UNES Orienta IA
              </h1>
              <p className='text-violet-200/80 font-medium tracking-wide'>
                ORIENTACION VOCACIONAL
              </p>
            </div>
          </div>

          <div className='space-y-6 max-w-lg'>
            <h2 className='text-3xl font-bold leading-tight'>
              Descubre tu carrera ideal en{' '}
              <span className='text-violet-400'>Universidad Espana Durango</span>.
            </h2>
            <p className='text-lg text-slate-400 leading-relaxed'>
              Violeta te acompana para explorar carreras, comparar opciones y
              resolver dudas de admisiones con una experiencia guiada por IA.
            </p>
          </div>

          <div className='grid gap-6'>
            {[
              {
                icon: GraduationCap,
                title: 'Carreras UNES',
                desc: 'Oferta academica organizada por areas profesionales',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10'
              },
              {
                icon: MessageCircle,
                title: 'Violeta orientadora',
                desc: 'Chat para comparar carreras y aclarar dudas',
                color: 'text-blue-400',
                bg: 'bg-blue-400/10'
              },
              {
                icon: BookOpen,
                title: 'Proyecto de vida',
                desc: 'Recursos para elegir con mayor claridad',
                color: 'text-violet-400',
                bg: 'bg-violet-400/10'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className='flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors'
              >
                <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className='font-semibold text-white'>{item.title}</h3>
                  <p className='text-sm text-slate-400'>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {page === 'login' && <Login onChange={setPage} />}
        {page === 'register' && <Register onChange={setPage} />}
      </div>
    </div>
  )
}

export default AuthPage
