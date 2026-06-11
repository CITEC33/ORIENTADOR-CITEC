import { useMemo } from 'react'

export const useDashboard = ({
  incidents = [],
  users = [],
  loadingIncidents,
  loadingUsers,
  dateFilter
}) => {
  const stats = useMemo(() => {
    const active = incidents.filter((i) => i.estado === 'Activo').length
    const attended = incidents.filter((i) => i.estado === 'Atendido').length
    const closed = incidents.filter(
      (i) => i.estado === 'Cerrado' || i.estado === 'Archivado'
    ).length

    return {
      totalUsers: users?.length || 0,
      totalIncidents: incidents.length,
      active,
      attended,
      closed
    }
  }, [incidents, users])

  const recentIncidents = useMemo(() => {
    if (!incidents.length) return []

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return incidents
      .filter((i) => {
        if (dateFilter === 'all') return true
        const triggeredDate = new Date(i.fecha_activacion)

        if (dateFilter === 'today') return triggeredDate >= today
        if (dateFilter === 'week') return triggeredDate >= weekAgo
        if (dateFilter === 'month') return triggeredDate >= monthAgo
        return true
      })
      .slice(0, 10)
  }, [incidents, dateFilter])

  const isLoading = loadingIncidents || loadingUsers

  return { stats, recentIncidents, isLoading }
}
