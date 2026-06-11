import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({
  isOpen,
  open,
  title,
  children,
  onClose,
  footer,
  size = 'lg'
}) {
  const show = open ?? isOpen

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (show) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [show, onClose])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <AnimatePresence>
      {show && (
        <div className='fixed inset-0 z-50 flex justify-center'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute bg-black/70 backdrop-blur-sm transition-all bottom-0 -top-10 left-0 right-0'
            aria-hidden='true'
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-[95%] ${sizes[size]} bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-700 mx-auto my-auto`}
            role='dialog'
            aria-modal='true'
          >
            <div className='flex items-center justify-between px-6 py-5 border-b border-gray-700 bg-gray-800 z-10 shrink-0'>
              <h2 className='text-xl font-bold text-white tracking-tight'>
                {title}
              </h2>
              <button
                onClick={onClose}
                className='p-2 -mr-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-purple-500/20'
                aria-label='Cerrar modal'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-2 md:p-6 text-gray-300'>
              {children}
            </div>

            {footer && (
              <div className='px-6 py-4 bg-gray-900 border-t border-gray-700 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl'>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
