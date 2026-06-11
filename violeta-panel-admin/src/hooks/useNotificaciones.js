import { useNotificacionesContext } from '../context/NotificacionesContext'

export function useNotificaciones() {
  const context = useNotificacionesContext()

  if (!context) {
    throw new Error(
      'useNotificaciones debe usarse dentro de un NotificacionesProvider'
    )
  }

  return context
}
