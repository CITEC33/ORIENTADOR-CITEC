import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useIncidenteNotasUsuarias(incidenteId) {
  const query = useQuery({
    queryKey: ['incidentes_notas_usuarias', incidenteId],
    enabled: Boolean(incidenteId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidentes_notas_usuarias')
        .select('id, comentario, created_at')
        .eq('incidente_id', incidenteId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    }
  })

  return {
    notasUsuaria: query.data || [],
    notasUsuariaLoading: query.isLoading,
    notasUsuariaError: query.error?.message
  }
}
