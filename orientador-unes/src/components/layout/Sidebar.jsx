import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  Compass,
  GraduationCap,
  Home,
  MessageCircle,
  Send,
  Users,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PanicButton } from '../PanicButton'
import logoUnesV2 from '../../assets/imgs/logo-unes-v2.png'
import AquilaAvatar from '../AquilaAvatar'

const Sidebar = ({ isOpen, onClose, handleModal, setMessage }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/test-vocacional', icon: Compass, label: 'Test Vocacional' },
    { path: '/chat', icon: MessageCircle, label: 'Platicar con Aquila' },
    { path: '/carreras-unes', icon: GraduationCap, label: 'Oferta educativa' },
    { path: '/vida-unes', icon: Users, label: 'Comunicarse con UNES' },
    { path: '/mi-orientacion', icon: BookOpen, label: 'Mi orientación' }
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm'
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 border-r border-blue-500/15 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background:
            'linear-gradient(180deg, #0a1f4d 0%, #081a44 50%, #050f34 100%)'
        }}
      >
        <div className='px-4 py-5 border-b border-blue-500/15'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 min-w-0'>
              <div
                className='h-12 w-16 rounded-md flex items-center justify-center px-1'
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(219,234,254,0.85))',
                  border: '1px solid rgba(147,197,253,0.4)'
                }}
              >
                <img
                  src={logoUnesV2}
                  alt='Universidad España'
                  className='h-full w-full object-contain'
                />
              </div>
              <div className='h-8 w-px bg-blue-400/25 rounded-full'></div>
              <div className='flex items-center gap-2 min-w-0'>
                <div
                  className='w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden'
                  style={{
                    background:
                      'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)',
                    boxShadow:
                      '0 6px 16px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.25)'
                  }}
                >
                  <AquilaAvatar
                    size='md'
                    border={false}
                    rounded='full'
                    className='w-full h-full'
                    alt='Aquila'
                  />
                </div>
                <div className='min-w-0'>
                  <span className='font-bold text-lg text-white leading-none block truncate'>
                    UNES Orienta IA
                  </span>
                  <span className='text-[10px] uppercase tracking-widest text-sky-300'>
                    Aquila
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className='lg:hidden -mr-2 p-1.5 text-blue-200/80 hover:text-white hover:bg-white/10 rounded-md transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <nav className='flex-1 overflow-y-auto py-6 px-4 space-y-1 sidebar-nav'>
          <p className='px-4 text-xs font-semibold text-blue-300/70 uppercase tracking-wider mb-2'>
            Menú principal
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-500/20 text-white border-l-4 border-sky-400'
                    : 'text-blue-100/85 hover:bg-white/5 hover:text-white hover:border-l-4 hover:border-sky-400/50'
                }`
              }
            >
              <item.icon className='w-5 h-5 opacity-90 group-hover:opacity-100' />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='p-4 border-t border-blue-500/15 bg-blue-950/30'>
          <div className='mb-3 px-2'>
            <h3 className='text-sky-300 font-bold flex items-center gap-2 text-sm uppercase tracking-wide'>
              <Send className='w-4 h-4' />
              Admisiones
            </h3>
          </div>
          <div className='space-y-3'>
            <PanicButton
              mode='sidebar'
              handleModal={handleModal}
              setMessage={setMessage}
            />
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
