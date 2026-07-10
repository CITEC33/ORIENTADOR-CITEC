import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { ModalPanicButton } from '../ModalPanicButton'

/**
 * Layout principal SIN sidebar: contenido + bottom-nav.
 */
const MainLayout = ({ modal, handleModal, message }) => {
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      {modal && (
        <ModalPanicButton handleModal={handleModal} message={message} />
      )}

      <main
        id='main-content'
        className='flex-1 overflow-y-auto w-full focus:outline-none unes-bg'
        style={{ paddingBottom: 'calc(76px + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}

export default MainLayout
