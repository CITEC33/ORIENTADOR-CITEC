import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAdmins() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['administradores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('administradores')
        .select('*')
        .order('fecha_registro', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const createMutation = useMutation({
    mutationFn: async ({ email, password, nombre }) => {
      // 1. Auth: Crear usuario (Sin auto-login)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nombre },
          autoSignIn: false // Importante
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Error al crear usuario en Auth')

      // 2. DB: Insertar usando la función segura (RPC)
      const { error: dbError } = await supabase.rpc('registrar_admin', {
        id_usuario: authData.user.id,
        email_usuario: email,
        nombre_usuario: nombre
      })

      // ROLLBACK: Si falla la BD (ej. duplicado), borrar el Auth creado
      if (dbError) {
        console.error('Error RPC:', dbError)
        // Intentamos borrar el usuario de Auth para no dejar basura
        await supabase.rpc('eliminar_usuario_total', {
          id_usuario: authData.user.id
        })
        throw new Error(dbError.message)
      }

      return authData
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['administradores'])
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, nombre }) => {
      const { error } = await supabase
        .from('administradores')
        .update({ nombre_completo: nombre })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries(['administradores'])
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Usamos la función total para borrar de Auth y DB
      const { error } = await supabase.rpc('eliminar_usuario_total', {
        id_usuario: id
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['administradores'])
    }
  })

  return {
    admins: query.data || [],
    loading: query.isLoading,
    error: query.error?.message,
    createAdmin: (email, password, nombre) =>
      createMutation.mutateAsync({ email, password, nombre }),
    updateAdmin: (id, nombre) => updateMutation.mutateAsync({ id, nombre }),
    deleteAdmin: (id) => deleteMutation.mutateAsync(id)
  }
}
