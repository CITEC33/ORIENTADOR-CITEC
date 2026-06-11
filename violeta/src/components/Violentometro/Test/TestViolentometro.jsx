import { motion, AnimatePresence } from 'framer-motion'
import { useTestViolentometro } from '../../../hooks/useTestViolentometro'
import { useEffect } from 'react'
import { ViolentometroResults } from './ViolentometroResults'
import { TEST_VIOLENTOMETRO_META } from '../../../lib/violentometro-data'

export const TestViolentometro = () => {
  const {
    isCompleted,
    currentQuestion,
    currentLevel,
    progress,
    currentQuestionIndex,
    result,
    VIOLENTOMETRO_QUESTIONS,
    resetAssessment,
    handleAnswer,
    isTransitioning
  } = useTestViolentometro()

  useEffect(() => {
    document.title = 'Test Violentómetro - Fuerza Violeta'
  }, [])

  if (isCompleted) {
    return <ViolentometroResults result={result} onReset={resetAssessment} />
  }

  if (!currentQuestion) return null

  const optionClass = (option) => {
    const base =
      'w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform active:scale-95 border-2 bg-gray-900/50'
    const disabled = isTransitioning ? 'opacity-50 cursor-not-allowed' : ''

    const map = {
      Nunca:
        'border-gray-700 text-gray-300 hover:border-emerald-500 hover:bg-emerald-900/30 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      'A veces':
        'border-gray-700 text-gray-300 hover:border-amber-500 hover:bg-amber-900/30 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      Frecuente:
        'border-gray-700 text-gray-300 hover:border-orange-500 hover:bg-orange-900/25 hover:text-orange-300 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)]',
      Siempre:
        'border-gray-700 text-gray-300 hover:border-red-500 hover:bg-red-900/30 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
    }

    return `${base} ${disabled} ${map[option] ?? ''}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='max-w-xl mx-auto'
    >
      {/* Progreso */}
      <div className='mb-6'>
        <div className='flex justify-between items-end mb-2'>
          <div>
            <span className='text-xs font-bold text-purple-400 uppercase tracking-wider'>
              {currentLevel?.emoji} Nivel {currentLevel?.id} –{' '}
              {currentLevel?.name}
            </span>
            <h2 className='text-gray-400 text-xs text-left'>
              {currentLevel?.description}
            </h2>
          </div>
          <span className='text-xs font-bold text-gray-500'>
            {currentQuestionIndex + 1} / {VIOLENTOMETRO_QUESTIONS.length}
          </span>
        </div>

        <div className='h-2 w-full bg-gray-700 rounded-full overflow-hidden'>
          <motion.div
            className='h-full bg-gradient-to-r from-purple-600 to-pink-600'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div className='flex flex-col justify-center'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-2xl shadow-black/40 border border-gray-700 text-center'
          >
            <h3 className='text-xl md:text-2xl font-bold text-white mb-8 leading-tight'>
              {currentQuestion.text}
            </h3>

            <div className='space-y-3'>
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isTransitioning}
                  className={optionClass(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className='mt-8 text-center text-xs text-gray-500'>
              Tus respuestas son anónimas y confidenciales.
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
