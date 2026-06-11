import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from './Loading'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loading />

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}
