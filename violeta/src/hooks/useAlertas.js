import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/customSupabaseClient'

export function useAlertas() {
  return useQuery({
    queryKey: ['alertas_cliente'],
    queryFn: async () => {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('alertas')
        .select('*')
        .or(`fecha_expiracion.is.null,fecha_expiracion.gt.${now}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })
}
