import { NavLink } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  Siren,
  Users,
  Megaphone,
  CalendarClock,
  TextInitial,
  X
} from 'lucide-react'
import { Badge } from './ui'
import logo_durango from '../assets/imgs/logo_durango.png'
import logo from '../assets/imgs/avatar-violeta.jpeg'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/incidentes', label: 'Incidentes', icon: Siren },
  { path: '/eventos', label: 'Eventos', icon: CalendarClock },
  { path: '/articulos', label: 'Artículos', icon: TextInitial },
  { path: '/alertas', label: 'Alertas', icon: Megaphone },
  { path: '/usuarias', label: 'Usuarias', icon: Users },
  { path: '/administradores', label: 'Administradores', icon: Shield }
]

export function Sidebar({ userEmail, closeSidebar }) {
  return (
    <div className='h-full flex flex-col bg-gray-800 border-r border-gray-700'>
      <div className='p-5 border-b border-gray-700 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg'>
            <img
              src={logo_durango}
              alt='Gobierno'
              className='h-11 w-auto object-contain rounded-md'
            />
          </div>

          <div className='h-8 w-px bg-gray-600 rounded-full'></div>

          <div className='flex items-center gap-2.5'>
            <div className='w-12 h-12 rounded-xl shadow-lg shadow-purple-900/40 shrink-0'>
              <img
                src={logo}
                alt='Violeta Logo'
                className='w-full h-full rounded-xl object-cover shrink-0'
              />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-black text-white text-base leading-none'>
                Violeta
              </div>
              <div className='text-[10px] text-gray-400 truncate mt-0.5'>
                Panel Admin
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={closeSidebar}
          className='lg:hidden text-gray-400 hover:text-white transition-colors'
        >
          <X className='w-6 h-6' />
        </button>
      </div>

      <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => {
                if (window.innerWidth < 1024 && closeSidebar) closeSidebar()
              }}
              className={({ isActive }) => `
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }
              `}
            >
              <Icon className='w-4 h-4 flex-shrink-0' />
              <span className='truncate flex-1 text-left'>{item.label}</span>
              {item.badge && (
                <Badge tone='white' className='text-xs bg-white/20 text-white'>
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className='p-4 border-t border-gray-700 space-y-3'>
        <div className='p-3 rounded-xl bg-gray-900 border border-gray-700'>
          <div className='text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold'>
            Sesión activa
          </div>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div
              className='text-sm font-bold text-gray-200 truncate max-w-[120px]'
              title={userEmail || 'Cargando...'}
            >
              {userEmail || 'Cargando...'}
            </div>
            <Badge tone='violeta'>admin</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
