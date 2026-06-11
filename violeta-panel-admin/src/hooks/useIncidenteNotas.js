import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { supabase } from '../lib/supabase'

async function buildAdministradoresMap(administradorIds) {
  const uniqueIds = [...new Set(administradorIds.filter(Boolean))]
  const administradoresMap = new Map()

  if (uniqueIds.length === 0) return administradoresMap

  const { data: admins, error: adminsError } = await supabase
    .from('administradores')
    .select('id, nombre_completo')
    .in('id', uniqueIds)

  if (!adminsError) {
    admins?.forEach((admin) => {
      administradoresMap.set(admin.id, {
        nombre: admin.nombre_completo || 'Administrador'
      })
    })
  } else {
    console.warn('No se pudieron cargar administradores de notas:', adminsError)
  }

  return administradoresMap
}

function getCurrentDateParts() {
  const now = dayjs()

  return {
    fecha: now.format('YYYY-MM-DD'),
    hora: now.format('HH:mm:ss')
  }
}

export function useIncidenteNotas(incidenteId) {
  const queryClient = useQueryClient()
  const queryKey = ['incidentes_notas', incidenteId]

  const query = useQuery({
    queryKey,
    enabled: Boolean(incidenteId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidentes_notas')
        .select('*')
        .eq('incidente_id', incidenteId)
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false })
        .order('id', { ascending: false })

      if (error) throw error

      const notas = data || []
      const administradoresMap = await buildAdministradoresMap(
        notas.map((nota) => nota.administrador_id)
      )

      return notas.map((nota) => ({
        ...nota,
        administrador: administradoresMap.get(nota.administrador_id) || null
      }))
    }
  })

  const createMutation = useMutation({
    mutationFn: async ({ comentario, administradorId }) => {
      const { fecha, hora } = getCurrentDateParts()
      const { data, error } = await supabase
        .from('incidentes_notas')
        .insert({
          fecha,
          hora,
          comentario,
          incidente_id: incidenteId,
          administrador_id: administradorId
        })
        .select('*')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, comentario, administradorId }) => {
      const { fecha, hora } = getCurrentDateParts()
      const { data, error } = await supabase
        .from('incidentes_notas')
        .update({
          fecha,
          hora,
          comentario,
          administrador_id: administradorId
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return {
    notas: query.data || [],
    notasLoading: query.isLoading,
    notasError: query.error?.message,
    savingNota: createMutation.isPending || updateMutation.isPending,
    createNota: (comentario, administradorId) =>
      createMutation.mutateAsync({ comentario, administradorId }),
    updateNota: (id, comentario, administradorId) =>
      updateMutation.mutateAsync({ id, comentario, administradorId })
  }
}
