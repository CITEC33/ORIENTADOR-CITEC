import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  Briefcase,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Globe2,
  GraduationCap,
  ListChecks,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Target,
  UserCheck
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getCareerBySlug,
  unesCareerDetails,
  unesContact,
  unesModalidades
} from '../data/unesCareers'
import {
  getCareerPlan,
  perfilEgresoPorArea,
  perfilIngresoPorArea
} from '../data/careerPlans'
import quilaAvatarPoster from '../assets/imgs/quila-avatar-poster.png'
import quilaAvatarVideo from '../assets/videos/quila-avatar-animated.mp4'

// Renderiza texto con **negritas** estilo markdown ligero
const renderBold = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className='text-sky-200 font-bold'>
          {p.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{p}</span>
  })
}

const MODALITY_ICONS = {
  cuatrimestre: CalendarRange,
  virtual: Globe2,
  sabatino: GraduationCap
}

const CarreraDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const career = useMemo(() => getCareerBySlug(slug), [slug])
  const plan = useMemo(() => (slug ? getCareerPlan(slug) : null), [slug])
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (career) {
      document.title = `${career.name} · UNES Orienta IA`
    } else {
      document.title = 'Carrera no encontrada · UNES Orienta IA'
    }
  }, [career])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play?.().catch(() => {})
    if (v.readyState >= 2) tryPlay()
    v.addEventListener('canplay', tryPlay)
    return () => v.removeEventListener('canplay', tryPlay)
  }, [career])

  if (!career) {
    return (
      <div className='min-h-screen flex items-center justify-center px-6 py-12'>
        <div
          className='max-w-md w-full text-center rounded-3xl p-8'
          style={{
            background:
              'linear-gradient(165deg, rgba(30,64,175,0.45), rgba(8,26,76,0.7))',
            border: '1px solid rgba(147,197,253,0.25)',
            boxShadow: '0 12px 32px rgba(2,13,51,0.4)'
          }}
        >
          <Sparkles className='w-10 h-10 text-sky-300 mx-auto mb-3' />
          <h1 className='text-xl font-bold text-white mb-2'>
            No encontramos esa carrera
          </h1>
          <p className='text-blue-100/80 text-sm mb-5'>
            Es posible que el enlace haya cambiado. Vuelve a la oferta educativa
            para explorar todas las carreras disponibles.
          </p>
          <Link
            to='/carreras-unes'
            className='inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white'
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              boxShadow: '0 6px 14px rgba(59,130,246,0.4)'
            }}
          >
            <ArrowLeft className='w-4 h-4' />
            Volver a la oferta educativa
          </Link>
        </div>
      </div>
    )
  }

  const extra = unesCareerDetails[career.slug] || null
  const modalidadesFull = unesModalidades.filter((m) =>
    career.modalidades.includes(m.id)
  )

  // Perfil de ingreso/egreso: específico si tenemos plan, si no, fallback por área
  const perfilIngreso =
    plan?.perfilIngreso || perfilIngresoPorArea[career.areaId] || []
  const perfilEgreso =
    plan?.perfilEgreso || perfilEgresoPorArea[career.areaId] || []
  const planEstudios = plan?.planEstudios || []
  const optativas = plan?.optativas || []
  const rvoe = plan?.rvoe || null
  const hasDetailedPlan = planEstudios.length > 0

  return (
    <div className='min-h-screen px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-4xl mx-auto'
      >
        {/* Botón regresar */}
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white mb-4 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Regresar
        </button>

        {/* Hero de la carrera */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='rounded-3xl p-6 sm:p-8 mb-5 relative overflow-hidden'
          style={{
            background:
              'linear-gradient(165deg, rgba(30,64,175,0.55) 0%, rgba(8,26,76,0.85) 100%)',
            border: '1px solid rgba(147,197,253,0.25)',
            boxShadow: '0 18px 40px rgba(2,13,51,0.5)'
          }}
        >
          {/* Glow decorativo */}
          <div
            aria-hidden
            className='absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-50 blur-3xl pointer-events-none'
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)'
            }}
          />

          <div className='relative grid grid-cols-[1fr_auto] gap-4 items-start'>
            <div>
              <p className='text-sky-300 text-[11px] font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-2'>
                <span aria-hidden className='text-base'>
                  {career.areaIcon || '🎓'}
                </span>
                {career.areaName}
              </p>
              <h1 className='text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3'>
                {career.name}
              </h1>
              <p className='text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-3xl'>
                {career.description}
              </p>
            </div>
            {/* Aquila animada acompañando la carrera */}
            <div
              className='relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0'
              style={{
                border: '2px solid rgba(147,197,253,0.4)',
                boxShadow: '0 10px 24px rgba(2,13,51,0.5)'
              }}
            >
              <img
                src={quilaAvatarPoster}
                alt=''
                aria-hidden
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  videoReady ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <video
                ref={videoRef}
                src={quilaAvatarVideo}
                poster={quilaAvatarPoster}
                autoPlay
                loop
                muted
                playsInline
                preload='auto'
                aria-label='Aquila, mascota de UNES'
                onCanPlay={() => setVideoReady(true)}
                onLoadedData={() => setVideoReady(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  videoReady ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>

          <div className='relative'>

            {/* Quick stats fila */}
            <div className='mt-5 flex flex-wrap gap-2'>
              <span
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-100'
                style={{
                  background: 'rgba(8,26,76,0.6)',
                  border: '1px solid rgba(147,197,253,0.3)'
                }}
              >
                <GraduationCap className='w-3.5 h-3.5' />
                Licenciatura UNES
              </span>
              {career.modalidades.length > 0 && (
                <span
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-100'
                  style={{
                    background: 'rgba(8,26,76,0.6)',
                    border: '1px solid rgba(147,197,253,0.3)'
                  }}
                >
                  <Sparkles className='w-3.5 h-3.5' />
                  {career.modalidades.length} modalidad
                  {career.modalidades.length === 1 ? '' : 'es'}
                </span>
              )}
              {extra?.duration && (
                <span
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-100'
                  style={{
                    background: 'rgba(8,26,76,0.6)',
                    border: '1px solid rgba(147,197,253,0.3)'
                  }}
                >
                  <CalendarRange className='w-3.5 h-3.5' />
                  {extra.duration}
                </span>
              )}
            </div>
          </div>
        </motion.section>

        {/* Modalidades */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-5'
        >
          <h2 className='text-white text-lg font-bold mb-3 tracking-tight flex items-center gap-2'>
            <span aria-hidden>📅</span> Modalidades
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {modalidadesFull.map((m, i) => {
              const Icon = MODALITY_ICONS[m.id] || CalendarRange
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className='rounded-2xl p-4 flex gap-3'
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
                    border: '1px solid rgba(147,197,253,0.22)',
                    boxShadow: '0 8px 18px rgba(2,13,51,0.35)'
                  }}
                >
                  <div
                    className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0'
                    style={{
                      background:
                        'linear-gradient(145deg, #3b82f6, #1d4ed8)',
                      boxShadow:
                        '0 4px 10px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
                    }}
                  >
                    <Icon className='w-5 h-5 text-white' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-white font-bold text-sm'>{m.nombre}</p>
                    <p className='text-blue-100/75 text-xs leading-snug mt-0.5'>
                      {m.detalle}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Detalle ampliado (si existe) */}
        {extra && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-5'
          >
            {extra.perfil && (
              <div
                className='rounded-2xl p-5'
                style={{
                  background:
                    'linear-gradient(165deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
                  border: '1px solid rgba(147,197,253,0.2)'
                }}
              >
                <h3 className='text-white font-bold mb-2 flex items-center gap-2 text-sm'>
                  <CheckCircle2 className='w-4 h-4 text-sky-300' />
                  Perfil ideal
                </h3>
                <p className='text-blue-100/85 text-sm leading-relaxed'>
                  {extra.perfil}
                </p>
              </div>
            )}
            {extra.campo && (
              <div
                className='rounded-2xl p-5'
                style={{
                  background:
                    'linear-gradient(165deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
                  border: '1px solid rgba(147,197,253,0.2)'
                }}
              >
                <h3 className='text-white font-bold mb-2 flex items-center gap-2 text-sm'>
                  <Briefcase className='w-4 h-4 text-sky-300' />
                  Campo laboral
                </h3>
                <p className='text-blue-100/85 text-sm leading-relaxed'>
                  {extra.campo}
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* Perfil de Ingreso */}
        {perfilIngreso.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17 }}
            className='rounded-3xl p-5 sm:p-6 mb-5'
            style={{
              background:
                'linear-gradient(165deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
              border: '1px solid rgba(147,197,253,0.22)',
              boxShadow: '0 10px 24px rgba(2,13,51,0.4)'
            }}
          >
            <h2 className='text-white text-lg font-bold mb-3 tracking-tight flex items-center gap-2'>
              <div
                className='w-9 h-9 rounded-xl flex items-center justify-center'
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                  boxShadow: '0 4px 10px rgba(14,165,233,0.35)'
                }}
              >
                <UserCheck className='w-5 h-5 text-white' />
              </div>
              Perfil de Ingreso
            </h2>
            <p className='text-blue-100/70 text-xs mb-3'>
              Si te identificas con estas características, esta carrera es para ti.
            </p>
            <ul className='space-y-2'>
              {perfilIngreso.map((item, i) => (
                <li
                  key={i}
                  className='flex gap-2.5 text-sm text-blue-50/95 leading-relaxed'
                >
                  <CheckCircle2 className='w-4 h-4 text-sky-300 shrink-0 mt-0.5' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Perfil de Egreso */}
        {perfilEgreso.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
            className='rounded-3xl p-5 sm:p-6 mb-5'
            style={{
              background:
                'linear-gradient(165deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
              border: '1px solid rgba(147,197,253,0.22)',
              boxShadow: '0 10px 24px rgba(2,13,51,0.4)'
            }}
          >
            <h2 className='text-white text-lg font-bold mb-3 tracking-tight flex items-center gap-2'>
              <div
                className='w-9 h-9 rounded-xl flex items-center justify-center'
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  boxShadow: '0 4px 10px rgba(59,130,246,0.35)'
                }}
              >
                <Target className='w-5 h-5 text-white' />
              </div>
              Perfil de Egreso
            </h2>
            <p className='text-blue-100/70 text-xs mb-3'>
              Esto serás capaz de hacer al concluir tu formación en UNES.
            </p>
            <ul className='space-y-2'>
              {perfilEgreso.map((item, i) => (
                <li
                  key={i}
                  className='flex gap-2.5 text-sm text-blue-50/95 leading-relaxed'
                >
                  <Award className='w-4 h-4 text-sky-300 shrink-0 mt-0.5' />
                  <span>{renderBold(item)}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Plan de Estudios (interactivo) */}
        {hasDetailedPlan && (
          <PlanEstudiosInteractivo
            planEstudios={planEstudios}
            optativas={optativas}
          />
        )}

        {/* Materias Optativas */}
        {optativas.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className='rounded-3xl p-5 sm:p-6 mb-5'
            style={{
              background:
                'linear-gradient(165deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
              border: '1px solid rgba(147,197,253,0.22)',
              boxShadow: '0 10px 24px rgba(2,13,51,0.4)'
            }}
          >
            <h2 className='text-white text-lg font-bold mb-3 tracking-tight flex items-center gap-2'>
              <div
                className='w-9 h-9 rounded-xl flex items-center justify-center'
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  boxShadow: '0 4px 10px rgba(245,158,11,0.35)'
                }}
              >
                <ListChecks className='w-5 h-5 text-white' />
              </div>
              Materias Optativas
            </h2>
            <p className='text-blue-100/70 text-xs mb-3'>
              Personaliza tu formación eligiendo entre estas materias.
            </p>
            <div className='flex flex-wrap gap-2'>
              {optativas.map((op, i) => (
                <span
                  key={i}
                  className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-sky-100'
                  style={{
                    background: 'rgba(8,26,76,0.6)',
                    border: '1px solid rgba(147,197,253,0.28)'
                  }}
                >
                  {op}
                </span>
              ))}
            </div>
            {rvoe && (
              <p className='text-blue-100/60 text-[11px] mt-4 italic'>
                {rvoe}
              </p>
            )}
          </motion.section>
        )}

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
          className='rounded-3xl p-5 sm:p-6 mb-6'
          style={{
            background:
              'linear-gradient(160deg, rgba(59,130,246,0.4), rgba(29,78,216,0.6))',
            border: '1px solid rgba(147,197,253,0.35)',
            boxShadow: '0 14px 32px rgba(2,13,51,0.5)'
          }}
        >
          <h3 className='text-white font-bold text-lg sm:text-xl mb-1'>
            ¿Te interesa esta carrera?
          </h3>
          <p className='text-blue-50/90 text-sm mb-4'>
            Pregúntale a Aquila sobre requisitos, becas y modalidades, o
            contacta directamente con UNES Durango.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
            <Link
              to='/chat'
              state={{ careerSlug: career.slug, careerName: career.name }}
              className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
              style={{
                background:
                  'linear-gradient(135deg, #1d4ed8, #0a1f4d)',
                boxShadow:
                  '0 6px 14px rgba(2,13,51,0.5), inset 0 1px 0 rgba(255,255,255,0.18)'
              }}
            >
              <MessageCircle className='w-4 h-4' />
              Preguntar a Aquila
            </Link>
            <a
              href={`https://wa.me/${unesContact.whatsapp.replace(
                /[^0-9]/g,
                ''
              )}?text=${encodeURIComponent(
                `Hola, me interesa la carrera de ${career.name}. ¿Pueden darme más información?`
              )}`}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
              style={{
                background: 'rgba(8,26,76,0.6)',
                border: '1px solid rgba(147,197,253,0.35)'
              }}
            >
              <Send className='w-4 h-4' />
              WhatsApp UNES
            </a>
            <a
              href={`tel:${unesContact.phone}`}
              className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
              style={{
                background: 'rgba(8,26,76,0.6)',
                border: '1px solid rgba(147,197,253,0.35)'
              }}
            >
              <Phone className='w-4 h-4' />
              Llamar
            </a>
          </div>
        </motion.section>

        {/* Volver a oferta */}
        <Link
          to='/carreras-unes'
          className='inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Ver todas las carreras
        </Link>
      </motion.div>
    </div>
  )
}

/**
 * Plan de Estudios interactivo con tabs por ciclo (mobile-first).
 * Incluye stats al inicio y switch entre Cuadrícula / Tabs.
 */
const PlanEstudiosInteractivo = ({ planEstudios, optativas }) => {
  const [activeCiclo, setActiveCiclo] = useState(0)
  const totalMaterias = planEstudios.reduce(
    (sum, c) => sum + c.materias.length,
    0
  )
  const optativasEnCiclo = planEstudios.reduce(
    (sum, c) =>
      sum + c.materias.filter((m) => /optativa/i.test(m)).length,
    0
  )
  const slotsOptativos = optativasEnCiclo
  const obligatorias = totalMaterias - slotsOptativos

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.21 }}
      className='rounded-3xl p-5 sm:p-6 mb-5'
      style={{
        background:
          'linear-gradient(165deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
        border: '1px solid rgba(147,197,253,0.22)',
        boxShadow: '0 10px 24px rgba(2,13,51,0.4)'
      }}
    >
      <h2 className='text-white text-lg font-bold mb-3 tracking-tight flex items-center gap-2'>
        <div
          className='w-9 h-9 rounded-xl flex items-center justify-center'
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: '0 4px 10px rgba(139,92,246,0.35)'
          }}
        >
          <BookOpenCheck className='w-5 h-5 text-white' />
        </div>
        Plan de Estudios
      </h2>

      {/* Mini stats del plan */}
      <div className='grid grid-cols-3 gap-2 mb-4'>
        {[
          { k: planEstudios.length, v: 'Ciclos', accent: '#06b6d4' },
          { k: obligatorias, v: 'Materias', accent: '#3b82f6' },
          { k: slotsOptativos, v: 'Slots optativos', accent: '#8b5cf6' }
        ].map((s) => (
          <div
            key={s.v}
            className='rounded-xl p-2.5 text-center'
            style={{
              background: 'rgba(8,26,76,0.55)',
              border: '1px solid rgba(147,197,253,0.18)'
            }}
          >
            <span
              className='block text-xl font-extrabold'
              style={{ color: s.accent }}
            >
              {s.k}
            </span>
            <span className='block text-[10px] uppercase tracking-wider text-blue-100/70 mt-0.5'>
              {s.v}
            </span>
          </div>
        ))}
      </div>

      {/* Selector de ciclos (tabs scroll horizontal) */}
      <div className='mb-3 -mx-1 px-1 overflow-x-auto'>
        <div className='flex gap-1.5 min-w-min pb-1.5'>
          {planEstudios.map((ciclo, i) => {
            const active = i === activeCiclo
            return (
              <button
                key={ciclo.ciclo}
                type='button'
                onClick={() => setActiveCiclo(i)}
                className='shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all'
                style={{
                  background: active
                    ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                    : 'rgba(8,26,76,0.55)',
                  color: '#fff',
                  border: active
                    ? '1px solid rgba(255,255,255,0.4)'
                    : '1px solid rgba(147,197,253,0.2)',
                  boxShadow: active
                    ? '0 6px 14px rgba(6,182,212,0.35)'
                    : 'none'
                }}
              >
                {i + 1}° · {ciclo.ciclo.replace(/\s?Ciclo$/i, '').trim() || ciclo.ciclo}
              </button>
            )
          })}
        </div>
      </div>

      {/* Materias del ciclo activo */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeCiclo}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className='rounded-2xl p-4'
          style={{
            background: 'rgba(8,26,76,0.55)',
            border: '1px solid rgba(147,197,253,0.18)'
          }}
        >
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <span
                className='inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-extrabold text-white'
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #1d4ed8)',
                  boxShadow: '0 4px 10px rgba(6,182,212,0.35)'
                }}
              >
                {activeCiclo + 1}
              </span>
              <h3 className='text-white font-extrabold text-base tracking-tight'>
                {planEstudios[activeCiclo].ciclo}
              </h3>
            </div>
            <span className='text-[11px] text-sky-300 font-bold'>
              {planEstudios[activeCiclo].materias.length} materias
            </span>
          </div>
          <ul className='grid grid-cols-1 sm:grid-cols-2 gap-1.5'>
            {planEstudios[activeCiclo].materias.map((m, j) => {
              const isOptativa = /optativa/i.test(m)
              return (
                <li
                  key={j}
                  className='flex items-start gap-2 px-3 py-2 rounded-lg text-[13px] leading-snug'
                  style={{
                    background: isOptativa
                      ? 'rgba(139,92,246,0.15)'
                      : 'rgba(59,130,246,0.1)',
                    border: isOptativa
                      ? '1px solid rgba(139,92,246,0.28)'
                      : '1px solid rgba(147,197,253,0.18)'
                  }}
                >
                  <span
                    className='mt-0.5 shrink-0 text-xs'
                    style={{ color: isOptativa ? '#c4b5fd' : '#60a5fa' }}
                  >
                    {isOptativa ? '◆' : '•'}
                  </span>
                  <span className='text-blue-50/95'>{m}</span>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* Navegación rápida prev/next */}
      <div className='flex items-center justify-between mt-3'>
        <button
          type='button'
          onClick={() => setActiveCiclo((i) => Math.max(0, i - 1))}
          disabled={activeCiclo === 0}
          className='inline-flex items-center gap-1.5 text-xs text-blue-100/80 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        >
          <ArrowLeft className='w-3.5 h-3.5' />
          Ciclo anterior
        </button>
        <button
          type='button'
          onClick={() =>
            setActiveCiclo((i) => Math.min(planEstudios.length - 1, i + 1))
          }
          disabled={activeCiclo === planEstudios.length - 1}
          className='inline-flex items-center gap-1.5 text-xs text-blue-100/80 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        >
          Siguiente ciclo
          <ChevronRight className='w-3.5 h-3.5' />
        </button>
      </div>
    </motion.section>
  )
}

export default CarreraDetailPage
