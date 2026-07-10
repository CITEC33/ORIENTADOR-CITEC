import { NavLink } from 'react-router-dom'
import { Home, MessageCircle, GraduationCap, Compass, Phone } from 'lucide-react'

/**
 * Navegación inferior tipo tab-bar.
 * Sustituye al Sidebar. Solo botones, siempre visible.
 * (El apartado "Perfil" se retiró — la información del usuario se maneja
 *  desde el header de HomePage y el chat con Aquila.)
 */
const items = [
  { to: '/',                icon: Home,          label: 'Inicio' },
  { to: '/chat',            icon: MessageCircle, label: 'Aquila' },
  { to: '/test-vocacional', icon: Compass,       label: 'Test' },
  { to: '/carreras-unes',   icon: GraduationCap, label: 'Carreras' },
  { to: '/comunidad',       icon: Phone,         label: 'Contacto' }
]

const BottomNav = () => {
  return (
    <nav
      aria-label='Navegación principal'
      className='fixed bottom-0 left-0 right-0 z-40'
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background:
          'linear-gradient(180deg, rgba(10,31,77,0.7), rgba(10,31,77,0.98))',
        borderTop: '1px solid rgba(147,197,253,0.25)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 -8px 24px rgba(2,13,51,0.5)'
      }}
    >
      <ul className='max-w-md mx-auto flex items-stretch justify-between px-2'>
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to} className='flex-1'>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-blue-200/70 hover:text-white active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className='flex items-center justify-center w-11 h-11 rounded-2xl transition-all'
                    style={
                      isActive
                        ? {
                            background:
                              'linear-gradient(145deg, rgba(59,130,246,0.5), rgba(29,78,216,0.85))',
                            border: '1px solid rgba(147,197,253,0.5)',
                            boxShadow:
                              '0 6px 14px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.2)'
                          }
                        : {}
                    }
                  >
                    <Icon
                      className='w-5 h-5'
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  </span>
                  <span
                    className={`text-[10px] font-semibold tracking-wide uppercase ${
                      isActive ? 'text-white' : 'text-blue-200/70'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BottomNav
