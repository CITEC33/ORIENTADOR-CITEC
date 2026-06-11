import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/customSupabaseClient'

export function useEventos() {
  const query = useQuery({
    queryKey: ['eventos_comunidad'],
    queryFn: async () => {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .or(`fecha_expiracion.is.null,fecha_expiracion.gt.${now}`)
        .order('fecha_hora', { ascending: true })

      if (error) throw error
      return data
    }
  })

  return {
    eventos: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError
  }
}
