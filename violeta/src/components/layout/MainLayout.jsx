import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { ModalPanicButton } from '../ModalPanicButton'
import { useEnforceProfile } from '../../hooks/useEnforceProfile'

const MainLayout = ({ modal, handleModal, setMessage, message }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  useEnforceProfile()

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        handleModal={handleModal}
        setMessage={setMessage}
      />
      {modal && (
        <ModalPanicButton handleModal={handleModal} message={message} />
      )}

      <main
        className='flex-1 overflow-y-auto w-full focus:outline-none bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900'
        id='main-content'
      >
        <Outlet />
      </main>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className='fixed left-2 z-40 lg:hidden p-3 bg-gray-800 text-gray-200 rounded-full shadow-lg shadow-black/30 border border-purple-900/50 hover:bg-gray-700 active:bg-gray-600 transition-all'
        style={{
          top: 'calc(0.5rem + env(safe-area-inset-top))'
        }}
        aria-label='Abrir menú de navegación'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h7'
          />
        </svg>
      </button>
    </div>
  )
}

export default MainLayout
