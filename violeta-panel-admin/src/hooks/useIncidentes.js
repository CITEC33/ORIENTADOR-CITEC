import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useIncidentes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidentes')
        .select(
          `
          *,
          usuarias (
            id,
            nombre_completo,
            apellido_p,
            apellido_m,
            telefono,
            direccion,
            foto,
            contactos_emergencia (
              id,
              nombre_completo,
              telefono
            )
          )
        `
        )
        .order('fecha_activacion', { ascending: false })

      if (error) throw error
      return data
    },
    refetchInterval: 15000
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, nuevoEstado, campoFecha }) => {
      const updateData = { estado: nuevoEstado }
      if (campoFecha) updateData[campoFecha] = new Date().toISOString()

      const { data, error } = await supabase
        .from('incidentes')
        .update(updateData)
        .eq('folio', id)
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['incidentes'] })
  })

  const updateFaseRespuestaMutation = useMutation({
    mutationFn: async ({ id, fase_respuesta }) => {
      const { error } = await supabase
        .from('incidentes')
        .update({ fase_respuesta })
        .eq('folio', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['incidentes'] })
  })

  return {
    incidents: query.data || [],
    loading: query.isLoading,
    error: query.error?.message,
    markAsAttended: (id) =>
      updateStatusMutation.mutateAsync({
        id,
        nuevoEstado: 'Atendido',
        campoFecha: 'fecha_atencion'
      }),
    closeIncident: (id) =>
      updateStatusMutation.mutateAsync({
        id,
        nuevoEstado: 'Cerrado',
        campoFecha: 'fecha_cerrado'
      }),
    archiveIncident: (id) =>
      updateStatusMutation.mutateAsync({
        id,
        nuevoEstado: 'Archivado',
        campoFecha: 'fecha_archivado'
      }),
    updateFaseRespuesta: (id, fase_respuesta) =>
      updateFaseRespuestaMutation.mutateAsync({ id, fase_respuesta })
  }
}
