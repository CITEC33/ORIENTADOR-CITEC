import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useEventos() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['eventos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('fecha_hora', { ascending: true })

      if (error) throw error
      return data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (newEvent) => {
      const { data, error } = await supabase
        .from('eventos')
        .insert([newEvent])
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['eventos'])
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('eventos')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['eventos'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('eventos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['eventos'])
    }
  })

  return {
    eventos: query.data || [],
    loading: query.isLoading,
    createEvento: (data) => createMutation.mutateAsync(data),
    updateEvento: (id, data) => updateMutation.mutateAsync({ id, ...data }),
    deleteEvento: (id) => deleteMutation.mutateAsync(id)
  }
}
