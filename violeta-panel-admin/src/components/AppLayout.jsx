import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ROUTE_CONFIG } from '../lib/titulos-topbar'
import { NotificationHistory } from './Notificaciones/NotificationHistory'
import { Menu, X } from 'lucide-react'

export const AppLayout = () => {
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  const currentConfig = ROUTE_CONFIG[pathname] || {
    title: 'Sistema',
    subtitle: 'Panel Administrativo'
  }

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 flex overflow-hidden'>
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out bg-gray-800
        lg:relative lg:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <Sidebar
          userEmail={user?.email}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className='flex-1 h-screen overflow-auto flex flex-col relative'>
        <Topbar
          title={currentConfig.title}
          subtitle={currentConfig.subtitle}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenMenu={() => setIsSidebarOpen(true)}
        />

        <main className='flex-1 p-4 md:p-6'>
          <Outlet />
        </main>

        <NotificationHistory
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </div>
  )
}
