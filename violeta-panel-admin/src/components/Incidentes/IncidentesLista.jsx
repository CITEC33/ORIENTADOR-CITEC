import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useIncidentes } from '../../hooks/useIncidentes'
import { MapModal } from './MapModal'
import { Table } from './Table'
import { useLocation } from 'react-router-dom'

dayjs.locale('es')

const statusOptions = [
  'Todos',
  'Activos',
  'Atendidos',
  'Cerrados',
  'Archivados'
]

function getQueryFromSearch(search) {
  if (!search) return ''

  const params = new URLSearchParams(search)
  const id = params.get('id') || ''
  const nombre = params.get('nombre') || ''

  return `${id} ${decodeURIComponent(nombre)}`.trim()
}

export function IncidentesLista({ onSelectIncident, onOpenNotes }) {
  const { search } = useLocation()
  const { incidents, loading, markAsAttended } = useIncidentes()

  const [query, setQuery] = useState(() => getQueryFromSearch(search))
  const [statusFilter, setStatusFilter] = useState('Activos')
  const [mapIncident, setMapIncident] = useState(null)
  const [showMap, setShowMap] = useState(false)

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center h-96 text-purple-400'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-600 mb-4' />
        <p className='font-medium text-gray-400'>
          Sincronizando base de datos...
        </p>
      </div>
    )

  return (
    <div className='p-0 xl:p-6 max-w-[1600px] mx-auto space-y-6'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl shadow-black/20'>
        <div className='flex-1 space-y-4 w-full'>
          <h2 className='text-2xl font-bold text-white text-center xl:text-left'>
            Control de Incidentes
          </h2>
          <div className='relative group w-full xl:max-w-xl'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors' />
            <input
              className='w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all text-gray-200 placeholder-gray-500'
              placeholder='Buscar por folio, nombre de usuaria...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className='flex flex-wrap justify-center xl:justify-normal gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-700 overflow-x-auto no-scrollbar max-w-full'>
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === opt
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className='bg-gray-800 rounded-3xl border border-gray-700 shadow-xl shadow-black/20 overflow-hidden overflow-x-auto'>
        <Table
          onSelectIncident={onSelectIncident}
          markAsAttended={markAsAttended}
          incidents={incidents}
          statusFilter={statusFilter}
          query={query}
          setMapIncident={setMapIncident}
          setShowMap={setShowMap}
          onOpenNotes={onOpenNotes}
        />
      </div>

      <MapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        incident={mapIncident}
      />
    </div>
  )
}
