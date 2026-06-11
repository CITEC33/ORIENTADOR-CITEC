import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import dayjs from 'dayjs'

const NotificacionesContext = createContext()

const SOUND_URL =
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'

export function NotificacionesProvider({ children }) {
  const queryClient = useQueryClient()
  const audioRef = useRef(new Audio(SOUND_URL))
  const [permission, setPermission] = useState(Notification.permission)

  // 1. Carga de datos (React Query)
  const { data: notificaciones = [], isLoading } = useQuery({
    queryKey: ['notificaciones'],
    queryFn: async () => {
      const startOfDay = dayjs().startOf('day').toISOString()

      const { data, error } = await supabase
        .from('notificaciones')
        .select(
          `*, 
            incidentes (
              folio,
              usuarias (
                id,
                nombre_completo,
                apellido_p,
                apellido_m
              )
            )
          `
        )
        .gte('created_at', startOfDay)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })

  // 2. Permisos y Sonido
  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      audioRef.current.play().catch(() => {})
      toast.success('Alertas activadas')
    }
  }

  const playSound = () => {
    const audio = audioRef.current
    audio.currentTime = 0
    audio.volume = 1.0
    audio.play().catch((e) => console.log('Sonido bloqueado:', e))
  }

  // 3. SUSCRIPCIÓN REALTIME (ÚNICA)
  useEffect(() => {
    const channelName = `global-notif-room`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notificaciones' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const nueva = payload.new

            queryClient.setQueryData(['notificaciones'], (old = []) => [
              nueva,
              ...old
            ])

            playSound()

            const mensajeCorto =
              nueva.mensaje.length > 80
                ? nueva.mensaje.substring(0, 80) + '...'
                : nueva.mensaje

            toast.error(nueva.titulo.toUpperCase(), {
              description: mensajeCorto,
              duration: 8000,
              style: {
                background: '#fee2e2',
                border: '2px solid #ef4444',
                color: '#7f1d1d',
                fontWeight: 'bold'
              }
            })

            if (Notification.permission === 'granted') {
              new Notification(nueva.titulo, {
                body: nueva.mensaje,
                icon: '/favicon.ico'
              })
            }
          }

          if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(['notificaciones'], (old = []) =>
              old.map((n) => (n.id === payload.new.id ? payload.new : n))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  // A. Marcar UNA como leída
  const marcarComoLeidaMutation = useMutation({
    mutationFn: async (id) => {
      await supabase
        .from('notificaciones')
        .update({ estatus: 'Leida' })
        .eq('id', id)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(['notificaciones'])
      const prev = queryClient.getQueryData(['notificaciones'])
      queryClient.setQueryData(['notificaciones'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, estatus: 'Leida' } : n))
      )
      return { prev }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['notificaciones'], context.prev)
    }
  })

  // B. Marcar TODAS como leídas
  const marcarTodasComoLeidasMutation = useMutation({
    mutationFn: async () => {
      // Actualizamos todas las que estén como 'Pendiente'
      const { error } = await supabase
        .from('notificaciones')
        .update({ estatus: 'Leida' })
        .eq('estatus', 'Pendiente')

      if (error) throw error
    },
    onMutate: async () => {
      // 1. Cancelar queries
      await queryClient.cancelQueries(['notificaciones'])

      // 2. Snapshot
      const prev = queryClient.getQueryData(['notificaciones'])

      // 3. Optimistic Update: Ponemos todo el array local en estatus 'Leida'
      queryClient.setQueryData(['notificaciones'], (old = []) =>
        old.map((n) => ({ ...n, estatus: 'Leida' }))
      )

      return { prev }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['notificaciones'], context.prev)
      toast.error('Error al actualizar notificaciones')
    },
    onSuccess: () => {
      toast.success('Todas las notificaciones fueron marcadas como leídas')
    }
  })

  const unreadCount = notificaciones.filter(
    (n) => n.estatus === 'Pendiente'
  ).length

  const value = {
    notificaciones,
    isLoading,
    unreadCount,
    permission,
    requestPermission,
    marcarComoLeida: marcarComoLeidaMutation.mutate,
    marcarTodasComoLeidas: marcarTodasComoLeidasMutation.mutate
  }

  return (
    <NotificacionesContext.Provider value={value}>
      {children}
    </NotificacionesContext.Provider>
  )
}

export const useNotificacionesContext = () => useContext(NotificacionesContext)
