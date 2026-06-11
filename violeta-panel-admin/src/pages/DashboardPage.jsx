import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIncidentes } from '../hooks/useIncidentes'
import { useUsuarias } from '../hooks/useUsuarias'
import { useExportToCSV } from '../hooks/useExportToCSV'
import { useDashboard } from '../hooks/useDashboard'
import { Cards } from '../components/Dashboards/Cards'
import { Table } from '../components/Dashboards/Table'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { CheckCircle2, Volume2, VolumeX } from 'lucide-react'

const dateFilters = [
  { label: 'Hoy', value: 'today' },
  { label: '7 días', value: 'week' },
  { label: '30 días', value: 'month' },
  { label: 'Todo', value: 'all' }
]

export default function DashboardPage() {
  const { permission, requestPermission } = useNotificaciones()
  const {
    incidents,
    loading: loadingIncidents,
    dataUpdatedAt
  } = useIncidentes()
  const { users, loading: loadingUsers } = useUsuarias()
  const [dateFilter, setDateFilter] = useState('all')
  const { exportToCSV } = useExportToCSV(incidents)
  const { stats, recentIncidents, isLoading } = useDashboard({
    incidents,
    users,
    loadingIncidents,
    loadingUsers,
    dateFilter
  })

  useEffect(() => {
    document.title = 'Violeta - Panel de administración'
  }, [])

  return (
    <div className='p-0 md:p-6 space-y-6 md:space-y-8 max-w-[1600px] mx-auto text-gray-100'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-white tracking-tight'>
            Panel administrativo de Violeta
          </h1>
          <p className='text-gray-400 text-xs md:text-sm'>
            Resumen de actividad y monitoreo en tiempo real
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2 md:gap-4'>
          <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700 shadow-sm'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
            </span>
            <span className='text-[10px] md:text-xs font-medium text-gray-300 tabular-nums'>
              Act:{' '}
              {dayjs(dataUpdatedAt).isValid()
                ? dayjs(dataUpdatedAt).format('HH:mm:ss')
                : '--:--'}
            </span>
          </div>

          {permission === 'granted' ? (
            <div className='flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-500/30 rounded-full text-emerald-400'>
              <CheckCircle2 className='w-3.5 h-3.5' />
              <span className='text-[10px] md:text-xs font-bold'>
                Notificaciones activas
              </span>
            </div>
          ) : (
            <button
              onClick={requestPermission}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all active:scale-95 ${
                permission === 'denied'
                  ? 'bg-red-900/30 border-red-500/30 text-red-400'
                  : 'bg-purple-600 border-purple-500 text-white'
              }`}
            >
              {permission === 'denied' ? (
                <VolumeX className='w-3.5 h-3.5' />
              ) : (
                <Volume2 className='w-3.5 h-3.5' />
              )}
              <span className='text-[10px] md:text-xs font-bold'>
                {permission === 'denied'
                  ? 'Alertas Bloqueadas'
                  : 'Activar Notificaciones'}
              </span>
            </button>
          )}
        </div>
      </div>

      <Cards isLoading={isLoading} stats={stats} />

      <Table
        recentIncidents={recentIncidents}
        isLoading={isLoading}
        dateFilters={dateFilters}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        exportToCSV={exportToCSV}
      />
    </div>
  )
}
