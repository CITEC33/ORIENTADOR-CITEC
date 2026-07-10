import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronRight,
  Info,
  MessageCircle,
  RefreshCcw,
  Send,
  Sparkles,
  Trophy
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import AquilaAvatar from '../components/AquilaAvatar'
import {
  AREA_META,
  careersByArea,
  aquilaCheers,
  vocationalQuestions
} from '../data/vocationalTest'
import { unesContact } from '../data/unesCareers'

const totalQuestions = vocationalQuestions.length

const TestVocacionalPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0..totalQuestions-1, luego totalQuestions = resultado
  const [scores, setScores] = useState(() =>
    Object.keys(AREA_META).reduce((acc, k) => ({ ...acc, [k]: 0 }), {})
  )
  const [picked, setPicked] = useState(null)
  const [history, setHistory] = useState([]) // [{ qIdx, optIdx }]

  useEffect(() => {
    document.title = 'Test Vocacional · Aquila'
  }, [])

  useEffect(() => {
    setPicked(null)
  }, [step])

  const isResult = step >= totalQuestions
  const current = !isResult ? vocationalQuestions[step] : null
  const progress = Math.min(100, (step / totalQuestions) * 100)

  const handlePick = (optIdx) => {
    if (picked !== null) return
    setPicked(optIdx)
    const option = current.options[optIdx]
    setScores((prev) => {
      const next = { ...prev }
      Object.entries(option.scores).forEach(([area, pts]) => {
        next[area] = (next[area] || 0) + pts
      })
      return next
    })
    setHistory((h) => [...h, { qIdx: step, optIdx }])
    // Avanza después de mostrar el feedback
    setTimeout(() => setStep((s) => s + 1), 650)
  }

  const restart = () => {
    setStep(0)
    setScores(
      Object.keys(AREA_META).reduce((acc, k) => ({ ...acc, [k]: 0 }), {})
    )
    setPicked(null)
    setHistory([])
  }

  // Top 3 áreas
  const ranking = useMemo(() => {
    return Object.entries(scores)
      .map(([area, pts]) => ({ area, pts, ...AREA_META[area] }))
      .sort((a, b) => b.pts - a.pts)
  }, [scores])

  const maxScore = ranking[0]?.pts || 1

  return (
    <div className='min-h-screen px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto'>
      <div className='max-w-2xl mx-auto'>
        {/* Header con back */}
        <div className='flex items-center justify-between mb-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-100 transition-colors'
            style={{ textShadow: '0 1px 3px rgba(2,13,51,0.55)' }}
          >
            <ArrowLeft className='w-4 h-4' />
            Regresar
          </button>
          {!isResult && (
            <span
              className='text-[11px] uppercase tracking-widest text-white font-bold'
              style={{ textShadow: '0 1px 3px rgba(2,13,51,0.55)' }}
            >
              Pregunta {step + 1} de {totalQuestions}
            </span>
          )}
          {isResult && (
            <button
              type='button'
              onClick={restart}
              className='inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-cyan-100 transition-colors'
              style={{ textShadow: '0 1px 3px rgba(2,13,51,0.55)' }}
            >
              <RefreshCcw className='w-3.5 h-3.5' />
              Reiniciar
            </button>
          )}
        </div>

        {/* Barra de progreso */}
        {!isResult && (
          <div className='mb-5'>
            <div
              className='h-2 rounded-full overflow-hidden'
              style={{ background: 'rgba(8,26,76,0.55)' }}
            >
              <motion.div
                className='h-full rounded-full'
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  background:
                    'linear-gradient(90deg, #06b6d4, #3b82f6, #1d4ed8)'
                }}
              />
            </div>
          </div>
        )}

        {/* Tarjeta de Aquila guiando */}
        {!isResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='flex items-center gap-3 mb-4'
          >
            <AquilaAvatar size='md' rounded='full' />
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className='relative rounded-2xl px-4 py-3 max-w-md'
              style={{
                background:
                  'linear-gradient(160deg, rgba(30,64,175,0.5), rgba(8,26,76,0.7))',
                border: '1px solid rgba(147,197,253,0.3)'
              }}
            >
              <span
                aria-hidden
                className='absolute -left-2 top-4 w-3 h-3 rotate-45'
                style={{
                  background:
                    'linear-gradient(160deg, rgba(30,64,175,0.5), rgba(8,26,76,0.7))',
                  borderLeft: '1px solid rgba(147,197,253,0.3)',
                  borderBottom: '1px solid rgba(147,197,253,0.3)'
                }}
              />
              <p className='text-white text-sm leading-snug'>
                {picked !== null
                  ? aquilaCheers[step % aquilaCheers.length]
                  : current.aquila}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Pregunta + opciones */}
        <AnimatePresence mode='wait'>
          {!isResult && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'
            >
              {current.options.map((opt, idx) => {
                const isPicked = picked === idx
                const isOther = picked !== null && !isPicked
                return (
                  <motion.button
                    key={idx}
                    type='button'
                    onClick={() => handlePick(idx)}
                    disabled={picked !== null}
                    whileHover={picked === null ? { y: -2 } : undefined}
                    whileTap={picked === null ? { scale: 0.98 } : undefined}
                    className='relative rounded-2xl p-3.5 flex items-start gap-3 text-left transition-all disabled:cursor-default'
                    style={{
                      background: isPicked
                        ? 'linear-gradient(135deg, #06b6d4, #1d4ed8)'
                        : 'linear-gradient(160deg, rgba(30,64,175,0.35), rgba(8,26,76,0.65))',
                      border: isPicked
                        ? '1px solid rgba(255,255,255,0.5)'
                        : '1px solid rgba(147,197,253,0.22)',
                      boxShadow: isPicked
                        ? '0 12px 28px rgba(6,182,212,0.45), inset 0 1px 0 rgba(255,255,255,0.25)'
                        : '0 6px 14px rgba(2,13,51,0.35)',
                      opacity: isOther ? 0.4 : 1
                    }}
                  >
                    <span
                      aria-hidden
                      className='text-2xl shrink-0 leading-none'
                    >
                      {opt.emoji}
                    </span>
                    <span className='text-white text-sm leading-snug font-medium flex-1'>
                      {opt.text}
                    </span>
                  </motion.button>
                )
              })}

              {/* Disclaimer informativo al pie del test */}
              <div className='sm:col-span-2 mt-4'>
                <TestDisclaimerBanner variant='intro' />
              </div>
            </motion.div>
          )}

          {/* RESULTADO */}
          {isResult && (
            <motion.div
              key='result'
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Disclaimer informativo al mostrar resultados */}
              <TestDisclaimerBanner variant='result' />

              {/* Hero del resultado */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='relative rounded-3xl p-6 sm:p-7 mb-5 overflow-hidden'
                style={{
                  background:
                    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #1d4ed8 100%)',
                  boxShadow:
                    '0 18px 40px rgba(6,182,212,0.45), inset 0 1px 0 rgba(255,255,255,0.25)'
                }}
              >
                <div
                  aria-hidden
                  className='absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-40 blur-3xl'
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)'
                  }}
                />
                <div className='relative flex items-center gap-4'>
                  <div className='shrink-0'>
                    <AquilaAvatar size='xl' rounded='full' />
                  </div>
                  <div>
                    <p className='text-cyan-100/95 text-[11px] uppercase tracking-[0.32em] font-bold'>
                      <Trophy className='inline w-3.5 h-3.5 mr-1' />
                      ¡Misión cumplida!
                    </p>
                    <h1 className='text-white text-2xl sm:text-3xl font-extrabold leading-tight mt-1'>
                      Tu vocación principal
                    </h1>
                    <p className='text-cyan-50/95 text-sm mt-1.5 leading-snug'>
                      Basado en tus respuestas, esto fue lo que descubrí:
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Top 1 destacado */}
              {ranking[0] && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='rounded-3xl p-5 sm:p-6 mb-5 relative overflow-hidden'
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(30,64,175,0.55), rgba(8,26,76,0.85))',
                    border: '1px solid rgba(147,197,253,0.3)',
                    boxShadow: '0 14px 32px rgba(2,13,51,0.5)'
                  }}
                >
                  <div className='flex items-center gap-3 mb-3'>
                    <div
                      className='w-14 h-14 rounded-2xl flex items-center justify-center text-3xl'
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        boxShadow: '0 8px 20px rgba(6,182,212,0.45)'
                      }}
                    >
                      <span aria-hidden>{ranking[0].icon}</span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sky-300 text-[10px] font-bold uppercase tracking-widest'>
                        Área #1 · {ranking[0].pts} pts
                      </p>
                      <h2 className='text-white text-lg sm:text-xl font-extrabold leading-tight'>
                        {ranking[0].label}
                      </h2>
                    </div>
                  </div>
                  <p className='text-blue-100/90 text-sm leading-relaxed mb-4'>
                    {ranking[0].summary}
                  </p>
                  {/* Carreras recomendadas */}
                  <div className='space-y-2'>
                    <p className='text-[11px] uppercase tracking-wider text-blue-200/70 font-bold mb-1.5'>
                      Carreras UNES recomendadas para ti
                    </p>
                    {(careersByArea[ranking[0].area] || [])
                      .slice(0, 3)
                      .map((c) => (
                        <Link
                          key={c.slug}
                          to={`/carreras-unes/${c.slug}`}
                          className='flex items-center gap-2 px-3.5 py-3 rounded-xl group transition-all hover:-translate-y-0.5'
                          style={{
                            background: 'rgba(8,26,76,0.55)',
                            border: '1px solid rgba(147,197,253,0.22)'
                          }}
                        >
                          <Award className='w-4 h-4 text-sky-300 shrink-0' />
                          <span className='text-white font-bold text-sm flex-1 leading-snug'>
                            {c.nombre}
                          </span>
                          <ChevronRight className='w-4 h-4 text-blue-100/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform' />
                        </Link>
                      ))}
                  </div>
                </motion.section>
              )}

              {/* Áreas secundarias */}
              {ranking.slice(1, 3).length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='mb-5'
                >
                  <h3 className='text-white text-sm font-bold mb-3 flex items-center gap-2'>
                    <Sparkles className='w-4 h-4 text-sky-300' />
                    También te puede interesar
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {ranking.slice(1, 3).map((r, i) => (
                      <div
                        key={r.area}
                        className='rounded-2xl p-4'
                        style={{
                          background:
                            'linear-gradient(160deg, rgba(30,64,175,0.4), rgba(8,26,76,0.7))',
                          border: '1px solid rgba(147,197,253,0.22)'
                        }}
                      >
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-2xl' aria-hidden>
                            {r.icon}
                          </span>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sky-300 text-[9px] uppercase tracking-widest font-bold'>
                              Área #{i + 2} · {r.pts} pts
                            </p>
                            <h4 className='text-white text-sm font-bold leading-tight'>
                              {r.label}
                            </h4>
                          </div>
                        </div>
                        {(careersByArea[r.area] || [])
                          .slice(0, 2)
                          .map((c) => (
                            <Link
                              key={c.slug}
                              to={`/carreras-unes/${c.slug}`}
                              className='block text-blue-50/90 text-xs py-1 hover:text-white transition-colors'
                            >
                              · {c.nombre}
                            </Link>
                          ))}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Distribución completa */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='rounded-3xl p-5 mb-5'
                style={{
                  background:
                    'linear-gradient(160deg, rgba(30,64,175,0.35), rgba(8,26,76,0.65))',
                  border: '1px solid rgba(147,197,253,0.2)'
                }}
              >
                <h3 className='text-white text-sm font-bold mb-3'>
                  Distribución completa
                </h3>
                <div className='space-y-2'>
                  {ranking.map((r) => {
                    const pct = maxScore ? (r.pts / maxScore) * 100 : 0
                    return (
                      <div key={r.area}>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='text-xs text-blue-100/85 inline-flex items-center gap-1.5'>
                            <span aria-hidden>{r.icon}</span>
                            {r.label}
                          </span>
                          <span className='text-[11px] text-sky-300 font-bold'>
                            {r.pts} pts
                          </span>
                        </div>
                        <div
                          className='h-1.5 rounded-full overflow-hidden'
                          style={{ background: 'rgba(8,26,76,0.55)' }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className='h-full rounded-full'
                            style={{
                              background:
                                'linear-gradient(90deg, #06b6d4, #3b82f6)'
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.section>

              {/* CTAs */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='rounded-3xl p-5 mb-6'
                style={{
                  background:
                    'linear-gradient(160deg, rgba(59,130,246,0.4), rgba(29,78,216,0.6))',
                  border: '1px solid rgba(147,197,253,0.35)',
                  boxShadow: '0 14px 32px rgba(2,13,51,0.5)'
                }}
              >
                <h3 className='text-white font-bold text-lg mb-2'>
                  ¿Quieres profundizar?
                </h3>
                <p className='text-blue-50/90 text-sm mb-4 leading-snug'>
                  Platica con Aquila para resolver dudas sobre tu vocación,
                  becas, modalidades o el plan de estudios.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  <Link
                    to='/chat'
                    state={{
                      vocationalArea: ranking[0]?.area,
                      vocationalLabel: ranking[0]?.label
                    }}
                    className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
                    style={{
                      background: 'linear-gradient(135deg, #1d4ed8, #0a1f4d)',
                      boxShadow:
                        '0 6px 14px rgba(2,13,51,0.5), inset 0 1px 0 rgba(255,255,255,0.18)'
                    }}
                  >
                    <MessageCircle className='w-4 h-4' />
                    Platicar con Aquila
                  </Link>
                  <a
                    href={`https://wa.me/${unesContact.whatsapp.replace(
                      /[^0-9]/g,
                      ''
                    )}?text=${encodeURIComponent(
                      `Hola, hice el Test Vocacional y me salió "${ranking[0]?.label}". Me gustaría más información.`
                    )}`}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5'
                    style={{
                      background: 'rgba(8,26,76,0.55)',
                      border: '1px solid rgba(147,197,253,0.35)'
                    }}
                  >
                    <Send className='w-4 h-4' />
                    Compartir con UNES
                  </a>
                </div>
                <div className='mt-3'>
                  <Link
                    to='/carreras-unes'
                    className='inline-flex items-center gap-1.5 text-sm text-cyan-100/95 hover:text-white transition-colors'
                  >
                    Ver todas las carreras UNES
                    <ArrowRight className='w-3.5 h-3.5' />
                  </Link>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Banner informativo del test vocacional.
 * `variant='intro'` → antes de comenzar (más grande y explicativo).
 * `variant='result'` → sobre los resultados (compacto).
 */
const TestDisclaimerBanner = ({ variant = 'intro' }) => {
  const isIntro = variant === 'intro'
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role='note'
      aria-label='Aviso informativo del test vocacional'
      className={`rounded-2xl ${isIntro ? 'p-4 mb-4' : 'p-3 mb-4'} flex items-start gap-3`}
      style={{
        background:
          'linear-gradient(160deg, rgba(251,191,36,0.16), rgba(217,119,6,0.10))',
        border: '1px solid rgba(251,191,36,0.35)',
        boxShadow: '0 6px 18px rgba(120,53,15,0.25)'
      }}
    >
      <div
        className='shrink-0 w-9 h-9 rounded-xl flex items-center justify-center'
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #b45309)',
          boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
        }}
      >
        {isIntro ? (
          <Info className='w-4 h-4 text-white' />
        ) : (
          <AlertTriangle className='w-4 h-4 text-white' />
        )}
      </div>
      <div className='flex-1'>
        <p className='text-amber-100 text-[13px] font-bold leading-tight'>
          {isIntro
            ? 'Este test es meramente informativo'
            : 'Recuerda: resultado meramente informativo'}
        </p>
        <p className='text-amber-100/85 text-[12px] leading-snug mt-0.5'>
          {isIntro
            ? 'Es una guía orientativa que sugiere áreas afines a tus intereses. No sustituye la asesoría de un orientador vocacional profesional ni garantiza éxito académico en una carrera.'
            : 'Es una guía orientativa, no un diagnóstico definitivo. Te recomendamos platicar con un orientador de UNES antes de tomar tu decisión final.'}
        </p>
      </div>
    </motion.div>
  )
}

export default TestVocacionalPage
