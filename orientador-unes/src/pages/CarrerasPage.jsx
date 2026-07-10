import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Send,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  unesCareerAreas,
  unesCareerCount,
  unesDoctorados,
  unesDoctoradosCount,
  unesMaestrias,
  unesMaestriasCount
} from '../data/unesCareers'
import careersBg from '../assets/imgs/library-unes.jpg'

const LEVELS = [
  { id: 'licenciatura', label: 'Licenciatura', Icon: GraduationCap },
  { id: 'maestria', label: 'Maestría', Icon: BookOpen },
  { id: 'doctorado', label: 'Doctorado', Icon: Award }
]

const CarrerasPage = () => {
  const [level, setLevel] = useState('licenciatura')

  useEffect(() => {
    document.title = 'Oferta educativa · UNES Orienta IA'
  }, [])

  const counts = {
    licenciatura: unesCareerCount,
    maestria: unesMaestriasCount,
    doctorado: unesDoctoradosCount
  }

  return (
    <div className='min-h-screen px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto'>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-6xl mx-auto'
      >
        {/* Hero — foto real de UNES a pantalla completa con overlay elegante */}
        <div
          className='relative mb-6 rounded-3xl overflow-hidden border'
          style={{
            borderColor: 'rgba(147,197,253,0.22)',
            boxShadow: '0 18px 40px rgba(2,13,51,0.45)'
          }}
        >
          <div className='relative h-[300px] sm:h-[360px]'>
            <img
              src={careersBg}
              alt='Oferta educativa UNES Durango'
              className='absolute inset-0 w-full h-full object-cover'
              draggable={false}
            />
            <div
              className='absolute inset-0'
              style={{
                background:
                  'linear-gradient(180deg, rgba(8,26,76,0.55) 0%, rgba(8,26,76,0.25) 35%, rgba(8,26,76,0.7) 75%, rgba(8,26,76,0.95) 100%)'
              }}
            />
            <div
              aria-hidden
              className='absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-40 blur-3xl'
              style={{
                background:
                  'radial-gradient(circle, rgba(96,165,250,0.75) 0%, transparent 70%)'
              }}
            />

            <div className='relative h-full flex flex-col items-center justify-end text-center px-5 pb-7'>
              <div
                className='w-14 h-14 rounded-2xl flex items-center justify-center mb-4'
                style={{
                  background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
                  border: '1px solid rgba(147,197,253,0.45)',
                  boxShadow:
                    '0 10px 26px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.28)'
                }}
              >
                <GraduationCap className='w-7 h-7 text-white' />
              </div>
              <p
                className='text-sky-200 text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.28em] mb-2'
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
              >
                UNES Orienta IA
              </p>
              <h1
                className='text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight'
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
              >
                Oferta educativa
              </h1>
              <p
                className='text-blue-100/90 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base'
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
              >
                Explora las licenciaturas, maestrías y doctorados de la
                Universidad España Durango. Pregúntale a Aquila para descubrir
                cuál encaja mejor con tu perfil.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-3 gap-3 sm:gap-4 mb-6'>
          {[
            {
              icon: Sparkles,
              value: unesCareerAreas.length,
              label: 'Áreas académicas'
            },
            {
              icon: Briefcase,
              value: unesCareerCount,
              label: 'Licenciaturas'
            },
            {
              icon: Award,
              value: unesMaestriasCount + unesDoctoradosCount,
              label: 'Posgrados'
            }
          ].map(({ icon: Ic, value, label }) => (
            <div
              key={label}
              className='rounded-2xl p-4 sm:p-5 text-center border'
              style={{
                background:
                  'linear-gradient(160deg, rgba(30,64,175,0.35), rgba(8,26,76,0.55))',
                borderColor: 'rgba(147,197,253,0.2)',
                boxShadow: '0 8px 24px rgba(2,13,51,0.35)'
              }}
            >
              <Ic className='w-6 h-6 text-sky-300 mx-auto mb-1.5' />
              <p className='text-2xl sm:text-3xl font-extrabold text-white'>
                {value}
              </p>
              <p className='text-[10px] sm:text-xs uppercase tracking-widest text-blue-200/70 mt-1'>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs Nivel */}
        <div
          className='inline-flex p-1 rounded-2xl mb-6 mx-auto w-full sm:w-auto'
          style={{
            background: 'rgba(8,26,76,0.6)',
            border: '1px solid rgba(147,197,253,0.18)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className='flex w-full gap-1'>
            {LEVELS.map(({ id, label, Icon }) => {
              const active = level === id
              return (
                <button
                  key={id}
                  onClick={() => setLevel(id)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    active
                      ? 'text-white shadow-lg'
                      : 'text-blue-200/80 hover:text-white'
                  }`}
                  style={
                    active
                      ? {
                          background:
                            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          boxShadow:
                            '0 6px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.18)'
                        }
                      : {}
                  }
                >
                  <Icon className='w-4 h-4' />
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-500/20 text-sky-300'
                    }`}
                  >
                    {counts[id]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contenido por nivel */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {level === 'licenciatura' && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                {unesCareerAreas.map((area) => (
                  <motion.article
                    key={area.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    className='rounded-3xl p-5 flex flex-col group'
                    style={{
                      background:
                        'linear-gradient(165deg, rgba(30,64,175,0.45) 0%, rgba(8,26,76,0.7) 100%)',
                      border: '1px solid rgba(147,197,253,0.2)',
                      boxShadow: '0 12px 32px rgba(2,13,51,0.4)'
                    }}
                  >
                    <div className='flex items-start gap-3 mb-2'>
                      <div
                        className='w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0'
                        style={{
                          background:
                            'linear-gradient(145deg, rgba(59,130,246,0.6), rgba(29,78,216,0.85))',
                          border: '1px solid rgba(147,197,253,0.35)',
                          boxShadow:
                            '0 6px 14px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}
                        aria-hidden
                      >
                        {area.icon || '🎓'}
                      </div>
                      <h2 className='text-lg sm:text-xl font-bold text-white tracking-tight pt-1'>
                        {area.area}
                      </h2>
                    </div>
                    <p className='text-xs sm:text-sm text-blue-100/75 leading-relaxed mb-4'>
                      {area.description}
                    </p>
                    <div className='space-y-2 mb-5 flex-1'>
                      {area.careers.map((career) => (
                        <Link
                          key={career.slug}
                          to={`/carreras-unes/${career.slug}`}
                          className='px-3 py-2 rounded-xl text-sm text-white flex items-center gap-2 transition-all hover:translate-x-0.5 hover:bg-blue-900/70'
                          style={{
                            background: 'rgba(8,26,76,0.55)',
                            border: '1px solid rgba(147,197,253,0.15)'
                          }}
                        >
                          <span className='w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0' />
                          <span className='truncate flex-1'>{career.name}</span>
                          <span className='text-sky-300/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity'>
                            ver →
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Link
                        to='/chat'
                        className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          boxShadow:
                            '0 6px 14px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
                        }}
                      >
                        <MessageCircle className='w-4 h-4' />
                        Preguntar a Aquila
                      </Link>
                      <Link
                        to='/vida-unes'
                        className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-sky-100 transition-colors'
                        style={{
                          background: 'rgba(8,26,76,0.6)',
                          border: '1px solid rgba(147,197,253,0.3)'
                        }}
                      >
                        <Send className='w-4 h-4' />
                        Solicitar info
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {level === 'maestria' && (
              <PosgradoList groups={unesMaestrias} levelLabel='Maestría' />
            )}
            {level === 'doctorado' && (
              <PosgradoList groups={unesDoctorados} levelLabel='Doctorado' />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const PosgradoList = ({ groups, levelLabel }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
    {groups.map((g) => (
      <motion.article
        key={g.area}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className='rounded-3xl p-5 flex flex-col'
        style={{
          background:
            'linear-gradient(165deg, rgba(30,64,175,0.45) 0%, rgba(8,26,76,0.7) 100%)',
          border: '1px solid rgba(147,197,253,0.2)',
          boxShadow: '0 12px 32px rgba(2,13,51,0.4)'
        }}
      >
        <p className='text-[10px] uppercase tracking-[0.25em] text-sky-300 font-bold mb-1'>
          {levelLabel}
        </p>
        <h2 className='text-lg font-bold text-white mb-4 tracking-tight'>
          {g.area}
        </h2>
        <ul className='space-y-2 flex-1'>
          {g.items.map((item) => (
            <li
              key={item}
              className='px-3 py-2 rounded-xl text-sm text-white flex items-start gap-2'
              style={{
                background: 'rgba(8,26,76,0.55)',
                border: '1px solid rgba(147,197,253,0.15)'
              }}
            >
              <span className='w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          to='/chat'
          className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white'
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            boxShadow:
              '0 6px 14px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
          }}
        >
          <MessageCircle className='w-4 h-4' />
          Preguntar a Aquila
        </Link>
      </motion.article>
    ))}
  </div>
)

export default CarrerasPage
