import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'
import { Loader2 } from 'lucide-react'
import { NotificacionesUsuaria } from './NotificacionesUsuaria'

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { user, session, loading, profile } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 text-purple-500 animate-spin mx-auto mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' />
          <p className='text-gray-400 font-medium'>Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: window.location.pathname }}
      />
    )
  }

  if (allowedRoles.length > 0) {
    const userRole = profile?.role || 'user'

    if (!allowedRoles.includes(userRole)) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-red-950'>
          <div className='max-w-md text-center p-8 bg-gray-900/50 backdrop-blur-md rounded-3xl border border-red-900/50 shadow-2xl shadow-black/50'>
            <div className='w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'>
              <span className='text-4xl filter drop-shadow-md'>!</span>
            </div>
            <h1 className='text-2xl font-bold text-white mb-2'>
              Acceso Denegado
            </h1>
            <p className='text-gray-400 mb-6 leading-relaxed'>
              No tienes permisos suficientes para acceder a esta seccion. Se
              requiere uno de los siguientes roles:{' '}
              <span className='text-red-400 font-mono text-sm px-1 py-0.5 bg-red-900/30 rounded'>
                {allowedRoles.join(', ')}
              </span>
            </p>
            <button
              onClick={() => window.history.back()}
              className='bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-900/40 hover:scale-105'
            >
              Volver
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      {children}
      <NotificacionesUsuaria />
    </>
  )
}

export default ProtectedRoute

