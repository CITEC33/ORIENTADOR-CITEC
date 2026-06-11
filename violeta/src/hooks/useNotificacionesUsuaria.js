import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/customSupabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'

export const useNotificacionesUsuaria = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id
  const queryKey = useMemo(() => ['notificaciones-usuaria', userId], [userId])

  const { data: notificaciones = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('notificaciones_usuarias')
        .select('*')
        .eq('usuaria_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    },
    enabled: !!userId
  })

  useEffect(() => {
    if (!userId) return undefined

    const channel = supabase
      .channel(`notificaciones_usuaria_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificaciones_usuarias',
          filter: `usuaria_id=eq.${userId}`
        },
        (payload) => {
          queryClient.setQueryData(queryKey, (old = []) => {
            const exists = old.some((notification) => notification.id === payload.new.id)
            const next = exists
              ? old.map((notification) =>
                  notification.id === payload.new.id ? payload.new : notification
                )
              : [payload.new, ...old]

            return next.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notificaciones_usuarias',
          filter: `usuaria_id=eq.${userId}`
        },
        (payload) => {
          queryClient.setQueryData(queryKey, (old = []) =>
            old
              .map((notification) =>
                notification.id === payload.new.id ? payload.new : notification
              )
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, queryKey, userId])

  const marcarComoLeidaMutation = useMutation({
    mutationFn: async (id) => {
      if (!userId) throw new Error('Usuario no autenticado')

      const { error } = await supabase
        .from('notificaciones_usuarias')
        .update({ leida_en: new Date().toISOString() })
        .eq('id', id)
        .eq('usuaria_id', userId)
        .is('leida_en', null)

      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const previousNotifications = queryClient.getQueryData(queryKey)
      const readAt = new Date().toISOString()

      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((notification) =>
          notification.id === id && !notification.leida_en
            ? { ...notification, leida_en: readAt }
            : notification
        )
      )

      return { previousNotifications }
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previousNotifications || [])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const marcarTodasComoLeidasMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuario no autenticado')

      const { error } = await supabase
        .from('notificaciones_usuarias')
        .update({ leida_en: new Date().toISOString() })
        .eq('usuaria_id', userId)
        .is('leida_en', null)

      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previousNotifications = queryClient.getQueryData(queryKey)
      const readAt = new Date().toISOString()

      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((notification) =>
          notification.leida_en
            ? notification
            : { ...notification, leida_en: readAt }
        )
      )

      return { previousNotifications }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousNotifications || [])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const unreadCount = useMemo(
    () => notificaciones.filter((notification) => !notification.leida_en).length,
    [notificaciones]
  )

  return {
    notificaciones,
    isLoading,
    unreadCount,
    marcarComoLeida: marcarComoLeidaMutation.mutate,
    marcarTodasComoLeidas: marcarTodasComoLeidasMutation.mutate,
    isMarkingAllRead: marcarTodasComoLeidasMutation.isPending
  }
}
