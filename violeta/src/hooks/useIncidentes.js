import { useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/customSupabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'

export const useIncidentes = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.id
  const incidentesQueryKey = useMemo(() => ['mis-incidentes', userId], [userId])

  const query = useQuery({
    queryKey: incidentesQueryKey,
    queryFn: async () => {
      if (!userId) return []

      const { data: incidentes, error } = await supabase
        .from('incidentes')
        .select('*')
        .eq('user_id', userId)
        .order('fecha_actualizacion', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      if (!incidentes?.length) return []

      const folios = incidentes.map((incidente) => incidente.folio)

      const [
        { data: notasAdmin, error: notasAdminError },
        { data: notasUsuaria, error: notasUsuariaError }
      ] = await Promise.all([
        supabase
          .from('incidentes_notas')
          .select('id, fecha, hora, comentario, incidente_id, administrador_id')
          .in('incidente_id', folios)
          .order('fecha', { ascending: false })
          .order('hora', { ascending: false }),
        supabase
          .from('incidentes_notas_usuarias')
          .select('id, created_at, comentario, incidente_id, user_id')
          .eq('user_id', userId)
          .in('incidente_id', folios)
          .order('created_at', { ascending: false })
      ])

      if (notasAdminError) {
        throw new Error(notasAdminError.message)
      }

      if (notasUsuariaError) {
        throw new Error(notasUsuariaError.message)
      }

      const notasPorIncidente = (notasAdmin || []).reduce((acc, nota) => {
        if (!acc[nota.incidente_id]) acc[nota.incidente_id] = []
        acc[nota.incidente_id].push(nota)
        return acc
      }, {})

      const notasUsuariaPorIncidente = (notasUsuaria || []).reduce(
        (acc, nota) => {
          if (!acc[nota.incidente_id]) acc[nota.incidente_id] = []
          acc[nota.incidente_id].push(nota)
          return acc
        },
        {}
      )

      return incidentes.map((incidente) => ({
        ...incidente,
        notas_admin: notasPorIncidente[incidente.folio] || [],
        notas_usuaria: notasUsuariaPorIncidente[incidente.folio] || []
      }))
    },
    refetchInterval: 15000
  })

  useEffect(() => {
    if (!userId) return undefined

    const invalidateIncidentes = () => {
      queryClient.invalidateQueries({ queryKey: incidentesQueryKey })
    }

    const channel = supabase
      .channel(`mis_incidentes_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidentes',
          filter: `user_id=eq.${userId}`
        },
        invalidateIncidentes
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidentes_notas_usuarias',
          filter: `user_id=eq.${userId}`
        },
        invalidateIncidentes
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidentes_notas'
        },
        invalidateIncidentes
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [incidentesQueryKey, queryClient, userId])

  const crearIncidenteMutation = useMutation({
    mutationFn: async (locationData) => {
      if (!userId) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('incidentes')
        .insert({
          user_id: userId,
          latitud: locationData.latitude,
          longitud: locationData.longitude,
          precision_gps: locationData.accuracy
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentesQueryKey })
    }
  })

  const crearNotaUsuariaMutation = useMutation({
    mutationFn: async ({ folio, comentario }) => {
      if (!userId) throw new Error('Usuario no autenticado')
      if (!folio) throw new Error('Folio de incidente no encontrado')

      const { data, error } = await supabase
        .from('incidentes_notas_usuarias')
        .insert({
          incidente_id: folio,
          user_id: userId,
          comentario
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentesQueryKey })
    }
  })

  const actualizarNotaUsuariaMutation = useMutation({
    mutationFn: async ({ id, comentario }) => {
      if (!userId) throw new Error('Usuario no autenticado')
      if (!id) throw new Error('Nota no encontrada')

      const { data, error } = await supabase
        .from('incidentes_notas_usuarias')
        .update({ comentario })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentesQueryKey })
    }
  })

  return {
    incidentes: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    activarSOS: crearIncidenteMutation.mutateAsync,
    isCreating: crearIncidenteMutation.isPending,
    crearNotaUsuaria: crearNotaUsuariaMutation.mutateAsync,
    actualizarNotaUsuaria: actualizarNotaUsuariaMutation.mutateAsync,
    isSavingNota:
      crearNotaUsuariaMutation.isPending || actualizarNotaUsuariaMutation.isPending
  }
}
