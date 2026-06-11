import dayjs from 'dayjs'
import {
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  MessageSquarePlus
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Table = ({
  onSelectIncident,
  markAsAttended,
  incidents,
  statusFilter,
  query,
  setMapIncident,
  setShowMap,
  onOpenNotes
}) => {
  const [processingId, setProcessingId] = useState(null)

  const onAttend = async (e, id) => {
    e.stopPropagation()
    setProcessingId(id)
    try {
      await markAsAttended(id)
      toast.success('Unidad en camino al incidente')
    } catch (err) {
      console.error(err)
      toast.error('Error al actualizar estado')
    } finally {
      setProcessingId(null)
    }
  }

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((i) => {
        if (statusFilter === 'Todos') return true
        const normalizedFilter = statusFilter.replace('s', '')
        return i.estado === normalizedFilter
      })
      .filter((i) => {
        if (!query.trim()) return true
        return `${i.folio} ${i.usuarias?.nombre_completo} ${i.usuarias?.apellido_p} ${i.usuarias?.apellido_m}`
          .toLowerCase()
          .includes(query.toLowerCase())
      })
  }, [incidents, statusFilter, query])

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full text-left border-collapse min-w-[800px]'>
        <thead>
          <tr className='bg-gray-900 border-b border-gray-700 text-center'>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Folio
            </th>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Usuaria
            </th>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Estatus
            </th>
            <th className='px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest text-center'>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-700'>
          {filteredIncidents.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className='px-6 py-12 text-center text-gray-500 italic'
              >
                No se encontraron incidentes.
              </td>
            </tr>
          ) : (
            filteredIncidents.map((incident) => (
              <tr
                key={incident.folio}
                onClick={() => onSelectIncident(incident)}
                className='group hover:bg-gray-700/30 transition-colors cursor-pointer text-center'
              >
                <td className='px-6 py-5'>
                  <span className='font-mono font-bold text-purple-400 bg-purple-900/30 px-2 py-1 rounded-lg border border-purple-500/20'>
                    #{incident.folio}
                  </span>
                  <div className='flex items-center gap-1.5 mt-2 text-xs text-gray-400 font-bold uppercase tracking-tighter justify-center'>
                    <Clock className='w-3 h-3 shrink-0' />
                    {dayjs(incident.fecha_activacion).format('DD MMM, hh:mm A')}
                  </div>
                </td>
                <td className='px-6 py-5'>
                  <div className='font-bold text-white leading-tight group-hover:text-purple-300 transition-colors'>
                    {incident.usuarias?.nombre_completo}{' '}
                    {incident.usuarias?.apellido_p}{' '}
                    {incident.usuarias?.apellido_m}
                  </div>
                  <div className='text-sm text-gray-400 mt-1'>
                    {incident.usuarias?.telefono}
                  </div>
                </td>
                <td className='px-6 py-5'>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      incident.estado === 'Activo'
                        ? 'bg-red-900/30 text-red-400 border-red-500/50 shadow-red-900/20'
                        : incident.estado === 'Atendido'
                          ? 'bg-amber-900/30 text-amber-400 border-amber-500/50 shadow-amber-900/20'
                          : incident.estado === 'Cerrado'
                            ? 'bg-purple-900/30 text-purple-400 border-purple-500/50 shadow-purple-900/20'
                            : 'bg-gray-800 text-gray-400 border-gray-600'
                    }`}
                  >
                    {incident.estado}
                  </span>
                </td>
                <td className='px-5 py-5'>
                  <div className='flex items-center justify-center gap-2'>
                    {incident.estado === 'Activo' && (
                      <>
                        <button
                          onClick={(e) => onAttend(e, incident.folio)}
                          disabled={processingId === incident.folio}
                          className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-purple-600 transition-all shadow-md border border-gray-700 hover:border-purple-500 disabled:opacity-50'
                        >
                          {processingId === incident.folio ? (
                            <Loader2 className='w-3 h-3 animate-spin shrink-0' />
                          ) : (
                            <CheckCircle2 className='w-3 h-3 shrink-0' />
                          )}
                          Atender
                        </button>
                      </>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenNotes?.(incident)
                      }}
                      title='Gestionar notas'
                      className='p-2 text-gray-400 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-700 hover:text-white transition-colors'
                    >
                      <MessageSquarePlus size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMapIncident(incident)
                        setShowMap(true)
                      }}
                      title='Ver mapa'
                      className='p-2 text-gray-400 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-700 hover:text-white transition-colors'
                    >
                      <MapPin className='w-5 h-5 shrink-0' />
                    </button>
                    <button className=' text-gray-500 hover:text-white transition-colors'>
                      <ChevronRight className='w-5 h-5 shrink-0' />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
