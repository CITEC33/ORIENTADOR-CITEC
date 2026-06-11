import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import dayjs from 'dayjs'
import 'dayjs/locale/es-mx'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('es-mx')
dayjs.extend(relativeTime)

export function useUsuarias() {
  const query = useQuery({
    queryKey: ['usuarias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarias')
        .select(
          `*, 
          contactos_emergencia (
            nombre_completo,
            telefono
          )`
        )
        .order('fecha_registro', { ascending: false })

      if (error) throw error
      return data
    },
    refetchInterval: 15000,
    refetchIntervalInBackground: true,

    // Transformamos los datos aquí para tener fechas listas
    select: (data) => {
      return data.map((user) => ({
        ...user,
        fecha_formateada: dayjs(user.fecha_registro).format(
          'DD MMM YYYY, h:mm A'
        ),
        tiempo_relativo: dayjs(user.fecha_registro).fromNow(),
        dayjs_instance: dayjs(user.fecha_registro),
        contactos: user.contactos_emergencia || []
      }))
    }
  })

  // Retornamos un objeto limpio para usar en los componentes
  return {
    users: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt
  }
}
