import { LogOut, Bell, Siren, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui'
import { useAuth } from '../hooks/useAuth'
import { useNotificaciones } from '../hooks/useNotificaciones'

export function Topbar({ title, subtitle, onOpenNotifications, onOpenMenu }) {
  const { signOut } = useAuth()
  const { unreadCount } = useNotificaciones()

  return (
    <div className='px-4 md:px-6 py-4 border-b border-gray-700 bg-gray-800/90 backdrop-blur-md sticky top-0 z-30'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <button
            onClick={onOpenMenu}
            className='p-2 -ml-2 lg:hidden text-gray-400 hover:text-white'
          >
            <Menu className='w-6 h-6' />
          </button>

          <div className='min-w-0'>
            <h1 className='text-lg md:text-xl font-black text-white tracking-tight truncate'>
              {title}
            </h1>
            {subtitle && (
              <p className='text-xs font-medium text-gray-400 truncate mt-0.5'>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-3'>
          <Link
            to='/incidentes'
            className='hidden sm:flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-xl shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-all border border-rose-500'
          >
            <Siren className='w-5 h-5 animate-pulse' />
            <span className='hidden md:inline'>Incidentes</span>
          </Link>

          <button
            onClick={onOpenNotifications}
            className='relative p-2 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-all'
          >
            <Bell
              className={`w-5 h-5 md:w-6 md:h-6 ${unreadCount > 0 ? 'animate-wiggle text-purple-400' : ''}`}
            />
            {unreadCount > 0 && (
              <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-gray-800 animate-pulse'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className='h-6 w-px bg-gray-700 mx-1'></div>

          <Button
            variant='ghost'
            onClick={signOut}
            className='text-gray-200 hover:text-red-400 px-2 md:px-3'
          >
            <LogOut className='w-4 h-4' />
            <span className='hidden lg:inline ml-2'>Salir</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
