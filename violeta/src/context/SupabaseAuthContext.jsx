import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react'

import { supabase } from '../lib/customSupabaseClient'

const AuthContext = createContext(undefined)

const checkUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarias')
      .select('*, contactos_emergencia(*)')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  const handleSession = useCallback(async (currentSession) => {
    if (!currentSession) {
      setUser(null)
      setProfile(null)
      setSession(null)
      setLoading(false)
      return
    }

    const currentUser = currentSession.user

    if (user?.id === currentUser.id && profile) {
      setLoading(false)
      return
    }

    const userProfile = await checkUserProfile(currentUser.id)

    setSession(currentSession)
    setUser(currentUser)
    setProfile(userProfile)
    setLoading(false)

    setLoading(false)
  }, [])

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      handleSession(session)
    }

    getSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [handleSession])

  const signUp = useCallback(async (email, password, userData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { autoSignIn: false }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No se pudo crear el usuario')

      const { error: dbError } = await supabase.from('usuarias').insert([
        {
          id: authData.user.id,
          correo: email,
          nombre_completo: userData.nombreCompleto,
          apellido_p: userData.apellidoPaterno,
          apellido_m: userData.apellidoMaterno,
          telefono: userData.telefono,
          direccion: userData.direccion
        }
      ])

      if (dbError) {
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Error al guardar datos del perfil')
      }

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password
        })

      if (loginError) throw loginError

      return { user: authData.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return { error: { message: 'Credenciales inválidas' } }

    if (data.user) {
      const userProfile = await checkUserProfile(data.user.id)
      if (!userProfile) {
        await supabase.auth.signOut()
        return { data: null, error: { message: 'Credenciales inválidas' } }
      }
    }

    return { data, error: null }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.warn(
        'Error al cerrar sesión en servidor (posiblemente ya cerrada)'
      )
    } finally {
      setUser(null)
      setProfile(null)
      setSession(null)
      localStorage.removeItem('sb-mmnuvgvbqmwqrynprxnp-auth-token')
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      profile,
      signUp,
      signIn,
      signOut
    }),
    [user, session, loading, profile, signUp, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
