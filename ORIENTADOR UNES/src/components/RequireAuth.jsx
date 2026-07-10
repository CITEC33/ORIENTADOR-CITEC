import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

/**
 * Envoltorio para rutas que requieren un usuario logueado.
 * Si no hay usuario, redirige a /auth.
 */
const RequireAuth = ({ children }) => {
  const { user, ready } = useAuth()
  const loc = useLocation()

  if (!ready) return <Loading />
  if (!user) return <Navigate to='/auth' replace state={{ from: loc.pathname }} />
  return children
}

export default RequireAuth
