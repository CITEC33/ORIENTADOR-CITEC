import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAlertas() {
  const queryClient = useQueryClient()

  // 1. Obtener Alertas
  const query = useQuery({
    queryKey: ['alertas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alertas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  // 2. Crear Alerta
  const createMutation = useMutation({
    mutationFn: async (newAlert) => {
      const { data, error } = await supabase
        .from('alertas')
        .insert([newAlert])
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['alertas'])
    }
  })

  // 3. Actualizar Alerta
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('alertas')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['alertas'])
    }
  })

  // 4. Eliminar Alerta
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('alertas').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['alertas'])
    }
  })

  return {
    alertas: query.data || [],
    loading: query.isLoading,
    createAlerta: (data) => createMutation.mutateAsync(data),
    updateAlerta: (id, data) => updateMutation.mutateAsync({ id, ...data }),
    deleteAlerta: (id) => deleteMutation.mutateAsync(id)
  }
}
