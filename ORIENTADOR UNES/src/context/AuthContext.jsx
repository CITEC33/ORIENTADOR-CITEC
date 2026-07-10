import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, authStore } from '../lib/api'

/**
 * Contexto de autenticación de la app.
 * Auth sin contraseña: se identifica al usuario por email + datos personales.
 * El token Sanctum se guarda en localStorage y se envía en cada request.
 */
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStore.user())
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  // Al montar, valida el token con /auth/me. Si falla, limpia storage.
  useEffect(() => {
    let cancel = false
    const boot = async () => {
      if (!authStore.isLoggedIn()) {
        setReady(true)
        return
      }
      try {
        const r = await api.auth.me()
        if (!cancel && r?.user) {
          setUser(r.user)
          authStore.save({ user: r.user })
        }
      } catch (e) {
        if (!cancel) {
          authStore.clear()
          setUser(null)
        }
      } finally {
        if (!cancel) setReady(true)
      }
    }
    boot()
    return () => { cancel = true }
  }, [])

  const login = useCallback(async (email) => {
    setLoading(true)
    try {
      const r = await api.auth.login(email)
      authStore.save({ token: r.token, user: r.user })
      setUser(r.user)
      return r.user
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const r = await api.auth.register(payload)
      authStore.save({ token: r.token, user: r.user })
      setUser(r.user)
      return r.user
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await api.auth.logout() } catch {}
    authStore.clear()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
