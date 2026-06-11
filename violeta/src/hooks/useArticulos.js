import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/customSupabaseClient'

export function useArticulos() {
  return useQuery({
    queryKey: ['articulos_cliente'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articulos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })
}
