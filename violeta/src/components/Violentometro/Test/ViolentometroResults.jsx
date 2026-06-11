import { motion } from 'framer-motion'
import { AlertOctagon, RefreshCcw } from 'lucide-react'
import {
  RESULTS_DATA,
  CONSCIENCE_MESSAGE,
  TEST_VIOLENTOMETRO_META
} from '../../../lib/violentometro-data'

export const ViolentometroResults = ({ result, onReset }) => {
  const { bandKey, color, totalScore, maxScore, immediateHelp, levelScores } =
    result
  const data = RESULTS_DATA[bandKey]

  const colorClasses = {
    green:
      'bg-emerald-900/20 border-emerald-500/50 text-emerald-100 shadow-emerald-900/20',
    yellow:
      'bg-amber-900/20 border-amber-500/50 text-amber-100 shadow-amber-900/20',
    orange:
      'bg-orange-900/20 border-orange-500/50 text-orange-100 shadow-orange-900/20',
    red: 'bg-red-900/20 border-red-500/50 text-red-100 shadow-red-900/20'
  }

  const textColors = {
    green: 'text-emerald-300',
    yellow: 'text-amber-300',
    orange: 'text-orange-300',
    red: 'text-red-300'
  }

  const bgColors = {
    green: 'bg-emerald-600',
    yellow: 'bg-amber-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl p-4 pt-8 sm:p-8 border-2 ${colorClasses[color]} shadow-2xl text-center mb-8 relative overflow-hidden backdrop-blur-sm`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-2 ${bgColors[color]}`}
        />

        <div className='text-6xl mb-3 drop-shadow-lg'>{data.emoji}</div>

        <h2 className='text-3xl font-black mb-2 text-white'>
          PUNTAJE TOTAL: {totalScore} / {maxScore}
        </h2>

        <h3 className={`text-xl font-bold mb-4 ${textColors[color]}`}>
          {data.title}
        </h3>

        <p className='text-lg font-medium opacity-90 mb-6 text-gray-200'>
          {data.description}
        </p>

        {immediateHelp && (
          <div className='mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-left'>
            <div className='flex items-start gap-3'>
              <AlertOctagon className='w-6 h-6 text-red-300 mt-0.5' />
              <div>
                <div className='font-black text-white'>
                  Busca ayuda inmediata
                </div>
                <div className='text-gray-200 text-sm mt-1'>
                  {TEST_VIOLENTOMETRO_META.contacts.dmspLabel}:{' '}
                  {TEST_VIOLENTOMETRO_META.contacts.dmsp}
                  <br />
                  {TEST_VIOLENTOMETRO_META.contacts.unipavLabel}:{' '}
                  {TEST_VIOLENTOMETRO_META.contacts.unipav}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='mt-6 bg-gray-900/60 rounded-xl p-4 sm:p-6 text-left border border-white/5'>
          <h4 className='font-bold text-white mb-3'>Detalle por nivel</h4>

          {[
            { id: 1, label: 'Nivel 1', max: 6 * 3 },
            { id: 2, label: 'Nivel 2', max: 6 * 3 },
            { id: 3, label: 'Nivel 3', max: 4 * 3 }
          ].map((lvl) => {
            const score = levelScores?.[lvl.id] ?? 0
            const pct = Math.round((score / lvl.max) * 100)

            return (
              <div key={lvl.id} className='mb-3 last:mb-0'>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium text-gray-300'>{lvl.label}</span>
                  <span className='text-gray-400'>
                    {score} / {lvl.max}
                  </span>
                </div>
                <div className='h-2 w-full bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-purple-600'
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className='mt-6 bg-gray-900/60 rounded-xl p-4 sm:p-6 text-left border border-white/5'>
          <h4 className='font-bold text-white mb-3'>
            {CONSCIENCE_MESSAGE.title}
          </h4>
          <ul className='space-y-2 text-gray-300 text-sm md:text-base'>
            {CONSCIENCE_MESSAGE.lines.map((line, i) => (
              <li key={i} className='flex items-start gap-2'>
                <span className='mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0' />
                {line}
              </li>
            ))}
          </ul>

          <div className='mt-4 text-gray-200 text-sm'>
            {TEST_VIOLENTOMETRO_META.contacts.dmspLabel}:{' '}
            {TEST_VIOLENTOMETRO_META.contacts.dmsp}
            <br />
            {TEST_VIOLENTOMETRO_META.contacts.unipavLabel}:{' '}
            {TEST_VIOLENTOMETRO_META.contacts.unipav}
          </div>
        </div>

        <div className='mt-6 text-xs text-gray-400'>
          {TEST_VIOLENTOMETRO_META.disclaimer}
        </div>
      </motion.div>

      <button
        onClick={onReset}
        className='w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-900/50 transition-all flex items-center justify-center gap-2'
      >
        <RefreshCcw className='w-5 h-5' />
        Realizar nuevo diagnóstico
      </button>
    </div>
  )
}
