import { useEffect, useRef } from 'react'
import { supabase } from '../lib/customSupabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'
import { useLocation, useNavigate } from 'react-router-dom'

export const useEnforceProfile = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const verificationDone = useRef(false)

  useEffect(() => {
    if (loading || !user) return

    if (verificationDone.current) return

    if (location.pathname === '/perfil') return

    const checkProfileCompleteness = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('usuarias')
          .select('telefono, direccion')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        const { count, error: contactsError } = await supabase
          .from('contactos_emergencia')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (contactsError) throw contactsError

        const isComplete =
          userData?.telefono && userData?.direccion && count > 0

        if (!isComplete) {
          navigate('/perfil', { replace: true })
        } else {
          verificationDone.current = true
        }
      } catch (error) {
        console.error('Error verificando perfil')
      }
    }

    checkProfileCompleteness()
  }, [user, loading, navigate, location.pathname])
}
