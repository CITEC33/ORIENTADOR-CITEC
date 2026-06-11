import {
  CheckCircle2,
  Download,
  Filter,
  Loader2,
  Siren,
  Clock
} from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { StatusPill } from '../StatusPill'
import { Link } from 'react-router-dom'

export const Table = ({
  recentIncidents,
  isLoading,
  dateFilters,
  dateFilter,
  setDateFilter,
  exportToCSV
}) => {
  return (
    <div className='bg-gray-800 rounded-3xl border border-gray-700 shadow-xl shadow-black/20 overflow-hidden'>
      <div className='p-4 sm:p-6 border-b border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-lg font-bold text-white flex items-center gap-2'>
            <Siren className='w-5 h-5 text-purple-500' />
            Incidentes Recientes
          </h2>
          <p className='text-sm text-gray-400'>
            Monitoreo de los últimos 10 eventos registrados
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-3'>
          <button
            onClick={exportToCSV}
            className='flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 font-medium text-gray-300 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition-colors'
          >
            <Download className='w-4 h-4 shrink-0' />
            <span>Exportar Incidentes</span>
          </button>

          <Link
            to='/incidentes'
            className='flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 font-bold text-white bg-purple-600 border border-purple-500 rounded-lg hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/30'
          >
            Ver Todos
            <Siren className='w-4 h-4 shrink-0' />
          </Link>
        </div>
      </div>

      <div className='px-6 py-3 bg-gray-900/30 border-b border-gray-700 flex flex-wrap items-center gap-2 overflow-x-auto whitespace-nowrap'>
        <Filter className='w-4 h-4 text-gray-500 shrink-0' />
        <span className='text-xs font-semibold text-gray-400 mr-2 shrink-0'>
          Filtrar por:
        </span>
        {dateFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setDateFilter(filter.value)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              dateFilter === filter.value
                ? 'bg-purple-900/40 text-purple-300 shadow-sm ring-1 ring-purple-500/50'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className='min-h-[300px]'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
            <Loader2 className='w-8 h-8 animate-spin text-purple-500 mb-2' />
            <p className='text-sm'>Sincronizando datos...</p>
          </div>
        ) : recentIncidents.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
            <div className='w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-3 border border-gray-700'>
              <CheckCircle2 className='w-6 h-6 text-gray-600' />
            </div>
            <p className='text-sm font-medium text-gray-400'>Todo en orden</p>
            <p className='text-xs text-gray-600'>
              No hay incidentes registrados en este periodo.
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-700'>
            {recentIncidents.map((incident) => (
              <Link
                to={`/incidentes?id=${incident.folio}&nombre=${encodeURIComponent(`${incident.usuarias?.nombre_completo || ''} ${incident.usuarias?.apellido_p || ''} ${incident.usuarias?.apellido_m || ''}`)}`}
                key={incident.folio}
                className='group p-4 sm:px-6 hover:bg-gray-700/30 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4'
              >
                <div className='flex items-center flex-wrap justify-center sm:justify-normal gap-4 min-w-0'>
                  <div className='flex w-14 h-14 rounded-full bg-gray-900 items-center justify-center text-gray-500 font-bold text-xs border border-gray-700 overflow-hidden shrink-0'>
                    {incident.usuarias?.foto ? (
                      <img
                        src={incident.usuarias.foto}
                        className='w-full h-full object-cover'
                        alt={`Foto de ${incident.usuarias.nombre_completo} ${incident.usuarias.apellido_p} ${incident.usuarias.apellido_m}`}
                      />
                    ) : (
                      <div
                        className='rounded-full w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg text-xl'
                        title={`${incident.usuarias?.nombre_completo} ${incident.usuarias?.apellido_p} ${incident.usuarias?.apellido_m}`}
                      >
                        {incident.usuarias.nombre_completo?.charAt(0) || 'V'}
                        {incident.usuarias.apellido_p?.charAt(0) || 'I'}
                        {incident.usuarias.apellido_m?.charAt(0) || 'O'}
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 text-center sm:text-left'>
                    <div className='text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate'>
                      Folio: {incident.folio}
                    </div>
                    <div className='text-sm text-gray-300 mt-0.5 truncate'>
                      {incident.usuarias?.nombre_completo}{' '}
                      {incident.usuarias?.apellido_p}{' '}
                      {incident.usuarias?.apellido_m}
                    </div>
                    <div className='flex items-center justify-center sm:justify-normal gap-3 mt-1.5'>
                      <div className='flex items-center gap-1.5 text-xs text-gray-400'>
                        <Clock className='w-3.5 h-3.5 shrink-0' />
                        {formatDate(incident.fecha_activacion)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-wrap justify-center sm:justify-normal items-center shrink-0 gap-2'>
                  <p className='text-xs text-center sm:text-left bg-violet-300/20 text-violet-400 font-bold px-2 py-1 rounded-full border border-violet-500/50 shadow-sm'>
                    {incident.fase_respuesta}
                  </p>
                  <StatusPill status={incident.estado} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
