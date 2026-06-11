import { NavLink } from 'react-router-dom'
import {
  MessageCircle,
  Users,
  X,
  Activity,
  ShieldAlert,
  Home,
  User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PanicButton } from '../PanicButton'
import logo_durango from '../../assets/imgs/logo_durango.png'
import logo from '../../assets/imgs/avatar-violeta.jpeg'

const Sidebar = ({ isOpen, onClose, handleModal, setMessage }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/chat', icon: MessageCircle, label: 'Habla con Violeta' },
    { path: '/violentometro', icon: Activity, label: 'Violentómetro' },
    { path: '/comunidad', icon: Users, label: 'Comunidad segura' },
    { path: '/perfil', icon: User, label: 'Perfil' }
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 
        bg-gray-900 border-r border-gray-800 
        shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className='px-4 py-5 border-b border-gray-800'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <img
                src={logo_durango}
                alt='Gobierno'
                className='h-12 w-auto rounded-md object-contain bg-white/5'
              />

              <div className='h-8 w-px bg-gray-700 rounded-full'></div>

              <div className='flex items-center gap-2'>
                <div className='w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50 shrink-0'>
                  <img
                    src={logo}
                    alt='Fuerza Violeta Logo'
                    className='w-full h-full rounded-lg object-cover shrink-0'
                  />
                </div>

                <span className='font-bold text-xl text-white leading-none'>
                  Violeta
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className='lg:hidden -mr-2 p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <nav className='flex-1 overflow-y-auto py-6 px-4 space-y-1 sidebar-nav'>
          <p className='px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
            Menú Principal
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-purple-900/30 text-purple-400 border-l-4 border-purple-500'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-purple-300 hover:border-l-4 hover:border-purple-500/50'
                }`
              }
            >
              <item.icon className='w-5 h-5 opacity-90 group-hover:opacity-100' />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='p-4 bg-red-950/20 border-t border-red-900/30'>
          <div className='mb-3 px-2'>
            <h3 className='text-red-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wide'>
              <ShieldAlert className='w-4 h-4' />
              Zona de Emergencia
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
