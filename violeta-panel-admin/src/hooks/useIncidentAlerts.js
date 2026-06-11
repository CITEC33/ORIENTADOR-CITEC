import { useEffect, useRef } from 'react'
import { useIncidentes } from './useIncidentes' // Tu hook de TanStack Query
import { toast } from 'sonner'
import dayjs from 'dayjs'

const ALARM_URL =
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'

export function useIncidentAlerts() {
  const { data: incidents = [] } = useIncidentes()

  const lastIncidentIdRef = useRef(null)

  useEffect(() => {
    // 1. Si no hay incidentes, no hacemos nada
    if (incidents.length === 0) return

    // Asumimos que el incidente [0] es el más reciente porque tu hook useIncidentes ordena por fecha DESC
    const newestIncident = incidents[0]

    // 2. Primera carga de la página:
    // Solo guardamos el ID para tener referencia, NO sonamos (sería molesto al entrar)
    if (lastIncidentIdRef.current === null) {
      lastIncidentIdRef.current = newestIncident.id
      return
    }

    // 3. Detección de NUEVO incidente:
    // Si el ID del más reciente es diferente al que teníamos guardado...
    if (newestIncident.id !== lastIncidentIdRef.current) {
      // A. Reproducir Sonido
      const audio = new Audio(ALARM_URL)
      audio.volume = 1.0 // Volumen al máximo para alertas reales
      audio.play().catch((e) => console.error('Error reproduciendo audio:', e))

      // B. Notificación del Navegador (Push)
      if (Notification.permission === 'granted') {
        const noti = new Notification('🚨 NUEVA INCIDENCIA DETECTADA', {
          body: `Folio: ${newestIncident.folio} - ${newestIncident.estado}\n${dayjs().format('h:mm:ss A')}`,
          icon: '/favicon.ico', // Asegúrate de tener un icono
          requireInteraction: true, // Se queda pegada hasta que le den click
          tag: `incident-${newestIncident.id}` // Evita duplicados
        })

        noti.onclick = () => {
          window.focus()
          noti.close()
        }
      }

      // C. Toast en pantalla (Sonner)
      toast.error('Nueva Incidencia Recibida', {
        description: `Folio: ${newestIncident.folio} - ${newestIncident.usuarias?.nombre_completo} ${newestIncident.usuarias?.apellido_p} ${newestIncident.usuarias?.apellido_m}`,
        duration: 10000, // 10 segundos
        action: {
          label: 'Ver',
          onClick: () => console.log('Ir a incidente') // Aquí podrías navegar
        }
      })

      // 4. Actualizamos la referencia para no volver a sonar por el mismo
      lastIncidentIdRef.current = newestIncident.id
    }
  }, [incidents]) // Se ejecuta cada vez que TanStack Query actualiza la data (cada 15s)
}
