import { ShieldAlert, AlertTriangle, Info, Bell } from 'lucide-react'

export const getCategoryStyles = (color) => {
  const styles = {
    emerald: {
      bg: 'bg-emerald-900/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/50',
      iconBg: 'bg-emerald-900/50',
      badge:
        'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
    },
    rose: {
      bg: 'bg-rose-900/20',
      text: 'text-rose-400',
      border: 'border-rose-500/50',
      iconBg: 'bg-rose-900/50',
      badge:
        'bg-rose-900/60 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
    },
    blue: {
      bg: 'bg-blue-900/20',
      text: 'text-blue-400',
      border: 'border-blue-500/50',
      iconBg: 'bg-blue-900/50',
      badge:
        'bg-blue-900/60 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
    },
    purple: {
      bg: 'bg-purple-900/20',
      text: 'text-purple-400',
      border: 'border-purple-500/50',
      iconBg: 'bg-purple-900/50',
      badge:
        'bg-purple-900/60 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
    },
    orange: {
      bg: 'bg-orange-900/20',
      text: 'text-orange-400',
      border: 'border-orange-500/50',
      iconBg: 'bg-orange-900/50',
      badge:
        'bg-orange-900/60 text-orange-300 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
    }
  }
  return styles[color] || styles.purple
}

export const getPriorityConfig = (prioridad) => {
  switch (prioridad) {
    case 'Alta':
      return { color: 'rose', icon: ShieldAlert, label: 'Prioridad Alta' }
    case 'Media':
      return { color: 'orange', icon: AlertTriangle, label: 'Prioridad Media' }
    case 'Baja':
      return { color: 'purple', icon: Info, label: 'Prioridad Baja' }
    default:
      return { color: 'emerald', icon: Bell, label: 'General' }
  }
}
