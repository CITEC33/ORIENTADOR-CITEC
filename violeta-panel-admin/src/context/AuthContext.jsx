import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Verificamos si es admin en la base de datos
  const checkAdminRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('administradores')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (error || !data) return false
      return true
    } catch (err) {
      console.error('Error verificando rol:', err)
      return false
    }
  }

  useEffect(() => {
    let mounted = true

    const handleSession = async (session) => {
      try {
        // Caso 1: No hay sesión (Usuario no logueado)
        if (!session?.user) {
          if (mounted) {
            setUser(null)
            setSession(null)
            setIsAdmin(false)
          }
          return
        }

        // Caso 2: Hay sesión, verificamos si es Admin
        const isUserAdmin = await checkAdminRole(session.user.id)

        if (!isUserAdmin) {
          // Si no es admin, lo sacamos
          await supabase.auth.signOut()
          if (mounted) {
            setUser(null)
            setSession(null)
            setIsAdmin(false)
          }
        } else {
          // Si es admin, todo correcto
          if (mounted) {
            setUser(session.user)
            setSession(session)
            setIsAdmin(true)
          }
        }
      } catch (error) {
        console.error('Error crítico en sesión:', error)
      } finally {
        setLoading(false)
      }
    }

    // Suscripción a cambios de Supabase
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Verificación manual inmediata para respuesta rápida en el Login
    const isUserAdmin = await checkAdminRole(data.user.id)

    if (!isUserAdmin) {
      await supabase.auth.signOut()
      throw new Error('Acceso denegado: No tienes privilegios administrativos.')
    }

    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsAdmin(false)
  }

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signInAdmin,
    signOut,
    isAuthenticated: !!user && isAdmin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
