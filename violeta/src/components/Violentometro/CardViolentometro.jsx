import { motion } from 'framer-motion'
import { Activity, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react'

export const CardViolentometro = ({ level, idx }) => {
  const getCardStyles = (index) => {
    if (index === 0)
      return {
        border: 'border-emerald-500',
        bg: 'bg-gray-800',
        iconColor: 'text-emerald-500/20',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-900/30 text-emerald-400'
      }
    if (index === 1)
      return {
        border: 'border-amber-500',
        bg: 'bg-gray-800',
        iconColor: 'text-amber-500/20',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-900/30 text-amber-400'
      }
    return {
      border: 'border-red-500',
      bg: 'bg-gray-800',
      iconColor: 'text-red-500/20',
      textColor: 'text-red-400',
      badgeBg: 'bg-red-900/30 text-red-400'
    }
  }

  const styles = getCardStyles(idx)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`rounded-2xl p-8 border-t-8 shadow-xl shadow-black/30 hover:shadow-2xl transition-shadow relative overflow-hidden ${styles.border} ${styles.bg}`}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-100`}>
        <Activity className={`w-24 h-24 ${styles.iconColor}`} />
      </div>

      <div className='relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <span
            className={`text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full ${styles.badgeBg}`}
          >
            Fase {idx + 1}
          </span>
          <span className='text-2xl drop-shadow-md'>{level.emoji}</span>
        </div>

        <h3 className='text-2xl font-bold text-white mb-2'>{level.title}</h3>
        <p className='text-gray-400 mb-6 text-sm font-medium'>{level.desc}</p>

        <ul className='space-y-3'>
          {level.items.map((item, i) => (
            <li
              key={i}
              className='flex items-start gap-3 bg-black/20 p-2.5 rounded-lg border border-transparent hover:border-white/10 transition-colors'
            >
              {idx === 0 && (
                <CheckCircle
                  className={`w-4 h-4 ${styles.textColor} mt-0.5 shrink-0`}
                />
              )}
              {idx === 1 && (
                <AlertTriangle
                  className={`w-4 h-4 ${styles.textColor} mt-0.5 shrink-0`}
                />
              )}
              {idx === 2 && (
                <ShieldAlert
                  className={`w-4 h-4 ${styles.textColor} mt-0.5 shrink-0`}
                />
              )}
              <span className={`text-sm font-bold text-gray-300`}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
