import { motion } from 'framer-motion'
import { Wind, Sun, Anchor, Play, Pause, Check, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

export const useGuiasBienestar = () => {
  const BreathingExercise = () => {
    const [isActive, setIsActive] = useState(false)
    const [phaseText, setPhaseText] = useState('Presiona iniciar para comenzar')
    const [phase, setPhase] = useState('idle')

    useEffect(() => {
      let intervalId
      let timeouts = []

      if (isActive) {
        const runCycle = () => {
          setPhase('inhale')
          setPhaseText('🌸 Inhala suavemente por la nariz (4s)')

          const t1 = setTimeout(() => {
            setPhase('hold')
            setPhaseText('✋ Retén el aire (7s)')
          }, 4000)

          const t2 = setTimeout(() => {
            setPhase('exhale')
            setPhaseText('💨 Exhala lentamente por la boca (8s)')
          }, 11000)

          timeouts.push(t1, t2)
        }

        runCycle()
        intervalId = setInterval(runCycle, 19000)
      } else {
        setPhase('idle')
        setPhaseText('Inhala (4s) - Retén (7s) - Exhala (8s)')
      }

      return () => {
        clearInterval(intervalId)
        timeouts.forEach(clearTimeout)
      }
    }, [isActive])

    return (
      <div className='bg-gray-800 rounded-2xl p-4 sm:p-6 border border-blue-900/50 shadow-sm text-center'>
        <div className='mb-6'>
          <motion.p
            key={phaseText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-lg font-bold text-blue-300'
          >
            {phaseText}
          </motion.p>
        </div>

        <div className='relative w-full h-4 sm:h-6 bg-gray-700 rounded-full overflow-hidden shadow-inner mb-4'>
          {isActive && (
            <motion.div
              animate={{
                width: ['0%', '100%', '100%', '0%'],
                backgroundColor: ['#3B82F6', '#1D4ED8', '#60A5FA', '#3B82F6']
              }}
              transition={{
                duration: 19,
                ease: 'linear',
                repeat: Infinity,
                times: [0, 0.21, 0.58, 1]
              }}
              className='absolute top-0 left-0 h-full rounded-full'
            />
          )}
        </div>

        <p className='mb-8 text-gray-400 text-sm'>
          Sigue el ritmo: Inhala - Retén - Exhala
        </p>

        <div className='flex justify-center'>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 text-sm sm:text-base px-4 sm:px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
              isActive
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
            }`}
          >
            {isActive ? (
              <Pause className='w-4 h-4' />
            ) : (
              <Play className='w-4 h-4 fill-current' />
            )}
            {isActive ? 'Pausar' : 'Iniciar Ejercicio'}
          </button>
        </div>

        <div className='grid grid-cols-3 gap-2 mt-4 sm:mt-8 pt-6 border-t border-gray-700 text-xs text-gray-500 uppercase tracking-wider font-bold'>
          <div className={phase === 'inhale' ? 'text-blue-400' : ''}>
            1. Inhala
          </div>
          <div className={phase === 'hold' ? 'text-blue-400' : ''}>
            2. Retén
          </div>
          <div className={phase === 'exhale' ? 'text-blue-400' : ''}>
            3. Exhala
          </div>
        </div>
      </div>
    )
  }

  const guides = [
    {
      id: 'breathing',
      title: 'Respiración 4-7-8',
      desc: 'Técnica para reducir ansiedad en minutos.',
      icon: Wind,
      color: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
      ringColor: 'ring-blue-500',
      content: <BreathingExercise />
    },
    {
      id: 'grounding',
      title: 'Técnica 5-4-3-2-1',
      desc: "Ejercicio de 'Grounding' para volver a la realidad.",
      icon: Anchor,
      color: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30',
      ringColor: 'ring-emerald-500',
      content: (
        <div className='bg-gray-800 rounded-2xl border border-emerald-900/50 overflow-hidden '>
          <div className='p-2 sm:p-4 bg-emerald-900/20 border-b border-emerald-900/30 text-center text-emerald-300 font-medium'>
            Mira a tu alrededor y encuentra:
          </div>
          <div className='divide-y divide-gray-700'>
            {[
              { c: 5, t: 'Cosas que puedes ver', i: '👀' },
              { c: 4, t: 'Cosas que puedes tocar', i: '🤚' },
              { c: 3, t: 'Cosas que puedes oír', i: '👂' },
              { c: 2, t: 'Cosas que puedes oler', i: '👃' },
              { c: 1, t: 'Cosa que puedes saborear', i: '🍬' }
            ].map((item) => (
              <div
                key={item.c}
                className='flex items-center gap-4 p-2 sm:p-4 hover:bg-gray-700/50 transition-colors'
              >
                <span className='w-8 h-8 flex items-center justify-center bg-emerald-900/40 text-emerald-400 font-bold rounded-full shrink-0'>
                  {item.c}
                </span>
                <span className='text-gray-300 font-medium flex-1'>
                  {item.t}
                </span>
                <span className='text-2xl'>{item.i}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'affirmations',
      title: 'Afirmaciones de Poder',
      desc: 'Fortalece tu diálogo interno positivo.',
      icon: Sun,
      color: 'bg-amber-900/30 text-amber-400 border-amber-500/30',
      ringColor: 'ring-amber-500',
      content: (
        <div className='space-y-4'>
          <p className='text-center text-gray-400 italic mb-6'>
            Lee estas frases en voz alta para ti misma:
          </p>
          {[
            'Soy valiosa, suficiente y merezco respeto.',
            'Tengo la fuerza interior para superar esto.',
            'No estoy sola, es valiente pedir ayuda.',
            'Mi paz mental es mi prioridad hoy.'
          ].map((text, i) => (
            <div
              key={i}
              className='group flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left p-3 sm:p-5 bg-amber-900/20 rounded-xl border border-amber-900/40 hover:bg-amber-900/30 transition-colors cursor-default'
            >
              <div className='p-2 bg-gray-800 rounded-full text-amber-500 shadow-sm opacity-50 group-hover:opacity-100 transition-opacity'>
                <Check className='w-4 h-4' />
              </div>
              <p className='text-gray-200 font-medium sm:text-lg'>"{text}"</p>
            </div>
          ))}
        </div>
      )
    }
  ]

  return { guides }
}
