import React from 'react'
import { ArrowRight, BookOpen, Brain, GraduationCap, MessageCircle } from 'lucide-react'

const quickActions = [
  {
    id: 'opcion1',
    icon: <Brain />,
    label: 'Descubrir mi perfil vocacional',
    message: 'Quiero descubrir mi perfil vocacional'
  },
  {
    id: 'opcion2',
    icon: <GraduationCap />,
    label: 'Conocer carreras de UNES',
    message: 'Quiero conocer las carreras de UNES'
  },
  {
    id: 'opcion3',
    icon: <BookOpen />,
    label: 'Comparar carreras',
    message: 'Quiero comparar carreras de UNES'
  },
  {
    id: 'opcion4',
    icon: <MessageCircle />,
    label: 'Informacion de admisiones',
    message: 'Quiero informacion de admisiones'
  }
]

export function QuickActions({ onAction, disabled = false }) {
  return (
    <div className='grid sm:grid-cols-2 gap-3 sm:gap-3.5 w-full mx-auto py-3 sm:py-4 px-2 sm:px-4'>
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.message)}
          disabled={disabled}
          className='
            w-full px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl
            glass border border-blue-500/40
            text-slate-100 text-sm sm:text-base font-medium
            flex items-center gap-3 sm:gap-4
            transition-all duration-300
            hover:border-blue-400/70 hover:scale-[1.03] hover:shadow-blue
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            group
          '
          style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)' }}
        >
          <div
            className='w-8 h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            {React.cloneElement(action.icon, { className: 'w-5 h-5' })}
          </div>
          <span className='text-left flex-1 leading-snug sm:leading-relaxed text-[10px] sm:text-xs md:text-sm lg:text-base'>
            {action.label}
          </span>
          <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:translate-x-1 transition-transform duration-300 shrink-0' />
        </button>
      ))}
    </div>
  )
}
