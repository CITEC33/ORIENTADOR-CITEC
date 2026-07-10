import { motion } from 'framer-motion'
import {
  BookOpen,
  ChevronRight,
  Compass,
  GraduationCap,
  Mail,
  Sparkles,
  Gamepad2,
  Settings,
  LogOut
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import quilaPoster from '../assets/imgs/quila-avatar-poster.png'
import quilaVideo from '../assets/videos/quila-avatar-animated.mp4'
import logoUnesV2 from '../assets/imgs/logo-unes-v2.png'
import AiDisclaimerButton from '../components/AiDisclaimerButton'

const HomePage = () => {
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const { user, logout } = useAuth()
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    document.title = 'UNES Orienta IA · Aquila'
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play?.().catch(() => {})
    if (v.readyState >= 2) tryPlay()
    v.addEventListener('canplay', tryPlay)
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  const cards = [
    {
      to: '/test-vocacional',
      title: 'Descubre tu vocación',
      desc: 'Juega con Aquila y encuentra la carrera ideal para ti',
      Icon: Compass,
      tone: 'primary',
      featured: true
    },
    {
      to: '/chat',
      title: 'Platicar con Aquila',
      desc: 'Orientación vocacional personalizada con IA',
      Icon: GraduationCap,
      tone: 'primary'
    },
    {
      to: '/carreras-unes',
      title: 'Conocer la oferta educativa',
      desc: 'Explora nuestras 33 licenciaturas y posgrados',
      Icon: BookOpen,
      tone: 'soft'
    },
    {
      to: '/vida-unes',
      title: 'Comunicarse con UNES',
      desc: 'Contáctanos y recibe atención de nuestro equipo',
      Icon: Mail,
      tone: 'soft'
    }
  ]

  return (
    <div className='relative min-h-full w-full overflow-x-hidden'>
      {/* Decoración */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        <div
          className='absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-60 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)'
          }}
        />
        <div
          className='absolute top-1/3 -left-24 w-80 h-80 rounded-full opacity-40 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Top bar: logo UNES + acciones */}
      <div
        className='absolute z-20 left-0 right-0 flex items-center justify-between px-4'
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className='rounded-2xl px-2.5 py-1.5 backdrop-blur-md'
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(219,234,254,0.85))',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 6px 18px rgba(2,13,51,0.4)'
            }}
          >
            <img
              src={logoUnesV2}
              alt='Universidad España'
              className='h-7 sm:h-8 w-auto select-none pointer-events-none'
              draggable={false}
            />
          </div>
        </motion.div>

        <div className='flex items-center gap-2'>
          {/* ⚙️ Configuración → Panel Admin */}
          <Link
            to='/admin'
            aria-label='Panel de administración'
            className='w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95'
            style={{
              background:
                'linear-gradient(145deg, rgba(59,130,246,0.35), rgba(29,78,216,0.55))',
              border: '1px solid rgba(147,197,253,0.35)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 6px 18px rgba(2,13,51,0.45)'
            }}
          >
            <Settings className='w-5 h-5' />
          </Link>

          <AiDisclaimerButton variant='home' />
        </div>
      </div>

      {/* Hero */}
      <section className='relative pt-20 sm:pt-24 px-5 sm:px-8 pb-2'>
        <div className='max-w-md mx-auto grid grid-cols-[1fr_auto] items-center gap-3'>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='pt-1 min-w-0'
          >
            <span
              className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-2'
              style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(147,197,253,0.3)'
              }}
            >
              <Sparkles className='w-2.5 h-2.5' />
              Orientación vocacional
            </span>
            <h2 className='text-white text-2xl sm:text-[26px] font-semibold leading-tight tracking-tight'>
              {user ? `Hola ${user.nombre},` : 'Hola, soy'}
            </h2>
            <h1
              className='text-[52px] sm:text-[60px] font-extrabold tracking-tight leading-[0.95] mt-1'
              style={{
                background:
                  'linear-gradient(180deg, #bfdbfe 0%, #60a5fa 55%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 6px 18px rgba(59,130,246,0.45))'
              }}
            >
              Aquila
            </h1>
            <p className='mt-3 text-blue-50/90 text-[14px] leading-snug max-w-[16rem]'>
              Te ayudo a descubrir la carrera ideal para ti en UNES Durango.
            </p>
          </motion.div>

          {/* Avatar CIRCULAR de Aquila */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='relative quila-float w-40 sm:w-44 -mr-1 -mt-2'
          >
            {/* Halo animado detrás */}
            <div
              aria-hidden
              className='absolute inset-0 -z-10 rounded-full quila-pulse'
              style={{
                background:
                  'radial-gradient(circle, rgba(96,165,250,0.6) 0%, rgba(37,99,235,0.25) 45%, transparent 75%)',
                filter: 'blur(14px)'
              }}
            />
            {/* Anillo dorado/celeste */}
            <div
              className='relative aspect-square w-full rounded-full overflow-hidden'
              style={{
                background:
                  'linear-gradient(145deg, #60a5fa, #1d4ed8 60%, #1e3a8a)',
                padding: 4,
                boxShadow:
                  '0 20px 40px rgba(2,13,51,0.75), 0 0 24px rgba(59,130,246,0.4)'
              }}
            >
              <div
                className='w-full h-full rounded-full overflow-hidden bg-slate-900 relative'
                style={{
                  boxShadow: 'inset 0 4px 12px rgba(2,13,51,0.5)'
                }}
              >
                {prefersReducedMotion ? (
                  <img
                    src={quilaPoster}
                    alt='Aquila, mascota de UNES'
                    className='w-full h-full object-cover object-top select-none pointer-events-none'
                    draggable={false}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={quilaVideo}
                    poster={quilaPoster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload='auto'
                    aria-label='Aquila animada'
                    onCanPlay={() => setVideoReady(true)}
                    onLoadedData={() => setVideoReady(true)}
                    className={`w-full h-full object-cover object-top select-none pointer-events-none transition-opacity duration-500 ${
                      videoReady ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
                {!prefersReducedMotion && !videoReady && (
                  <img
                    src={quilaPoster}
                    alt=''
                    aria-hidden
                    className='absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none'
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cinta de stats institucionales */}
      <section className='relative px-5 sm:px-8 pt-3'>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className='max-w-md mx-auto grid grid-cols-3 gap-2 rounded-2xl p-3 text-center'
          style={{
            background:
              'linear-gradient(180deg, rgba(59,130,246,0.18), rgba(29,78,216,0.28))',
            border: '1px solid rgba(147,197,253,0.25)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
          }}
        >
          {[
            { k: '33', v: 'Licenciaturas' },
            { k: '11', v: 'Maestrías' },
            { k: '3', v: 'Doctorados' }
          ].map((s) => (
            <div key={s.v} className='flex flex-col'>
              <span className='text-white font-extrabold text-lg leading-none'>
                {s.k}
              </span>
              <span className='text-blue-100/75 text-[10.5px] mt-1 uppercase tracking-wider'>
                {s.v}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured: Test Vocacional */}
      <section className='relative px-5 sm:px-8 pt-5'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className='max-w-md mx-auto'
        >
          <Link
            to='/test-vocacional'
            className='relative block rounded-3xl p-5 overflow-hidden group'
            style={{
              background:
                'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #1d4ed8 100%)',
              boxShadow:
                '0 14px 32px rgba(6,182,212,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.18)'
            }}
          >
            <div
              aria-hidden
              className='absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-2xl'
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)'
              }}
            />
            <div className='relative flex items-center gap-3'>
              <div
                className='w-14 h-14 rounded-2xl flex items-center justify-center shrink-0'
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Gamepad2 className='w-7 h-7 text-white' strokeWidth={2.2} />
              </div>
              <div className='flex-1 min-w-0'>
                <span className='inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-100/90 mb-0.5'>
                  ✨ Minijuego de Aquila
                </span>
                <div className='text-white font-extrabold text-lg leading-tight'>
                  Test Vocacional
                </div>
                <div className='text-cyan-50/95 text-[12.5px] leading-snug mt-0.5'>
                  Responde 12 preguntas y descubre tu carrera ideal
                </div>
              </div>
              <ChevronRight className='w-5 h-5 text-white shrink-0 group-hover:translate-x-0.5 transition-transform' />
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Tarjetas de acceso */}
      <section className='relative px-5 sm:px-8 pt-3 pb-6'>
        <div className='max-w-md mx-auto space-y-3'>
          {cards.slice(1).map(({ to, title, desc, Icon, tone }, i) => (
            <motion.div
              key={to + title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
            >
              <Link
                to={to}
                className={`quila-card group ${
                  tone === 'soft' ? 'quila-card--soft' : ''
                }`}
              >
                <div className='quila-icon'>
                  <Icon className='w-7 h-7 text-white' strokeWidth={2.2} />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-white font-bold text-[17px] leading-tight'>
                    {title}
                  </div>
                  <div className='text-blue-100/80 text-[12.5px] leading-snug mt-1'>
                    {desc}
                  </div>
                </div>
                <ChevronRight className='w-5 h-5 text-blue-100/70 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0' />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sesión */}
      {user && (
        <section className='relative px-5 sm:px-8 pb-2'>
          <div className='max-w-md mx-auto flex items-center justify-between text-blue-200/70 text-[11.5px]'>
            <span>
              Sesión: <span className='text-white font-semibold'>{user.email}</span>
            </span>
            <button
              type='button'
              onClick={logout}
              className='inline-flex items-center gap-1 text-blue-200/70 hover:text-white transition-colors'
            >
              <LogOut className='w-3.5 h-3.5' /> Salir
            </button>
          </div>
        </section>
      )}

      {/* El éxito es ahora UNES */}
      <section className='relative px-5 sm:px-8 pb-6 pt-3'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className='max-w-md mx-auto rounded-3xl p-5 text-center relative overflow-hidden'
          style={{
            background:
              'linear-gradient(160deg, #0a1f4d 0%, #1d4ed8 60%, #1e40af 100%)',
            border: '1px solid rgba(147,197,253,0.3)',
            boxShadow: '0 14px 32px rgba(2,13,51,0.55)'
          }}
        >
          <div
            aria-hidden
            className='absolute inset-0 opacity-25 pointer-events-none'
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(147,197,253,0.15) 0px, rgba(147,197,253,0.15) 1px, transparent 1px, transparent 24px)'
            }}
          />
          <div className='relative'>
            <p className='text-blue-100/80 text-[11px] uppercase tracking-[0.32em] mb-1'>
              EL <span className='font-bold text-sky-300'>ÉXITO</span> ES AHORA
            </p>
            <p
              className='text-5xl sm:text-6xl font-extrabold tracking-tight my-1'
              style={{
                background:
                  'linear-gradient(180deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              UNES
            </p>
            <div className='mt-3 flex items-center justify-center gap-3 text-blue-100/90 text-xs'>
              <span className='inline-flex items-center gap-1'>
                <span aria-hidden>📞</span>
                <a href='tel:6188339000' className='hover:text-white'>
                  (618) 833 9000
                </a>
              </span>
              <span className='text-blue-300/40'>·</span>
              <span className='inline-flex items-center gap-1'>
                <span aria-hidden>💬</span>
                <a
                  href='https://wa.me/526181709766'
                  target='_blank'
                  rel='noreferrer'
                  className='hover:text-white'
                >
                  (618) 170 9766
                </a>
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='relative px-5 pb-4 pt-2'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45 }}
          className='max-w-md mx-auto flex flex-col items-center gap-2'
        >
          <div className='flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10'>
            <Sparkles className='w-3 h-3 text-sky-300' />
            <p className='text-[10.5px] uppercase tracking-[0.28em] text-blue-200/70'>
              Hecho con Aquila · By CITEC
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}

export default HomePage
