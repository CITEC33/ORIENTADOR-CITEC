import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  CheckCircle2,
  User,
  Phone,
  Home,
  AlertTriangle,
  Loader2,
  Save,
  Navigation,
  Archive,
  CalendarClock,
  MessageSquare,
  MessageSquarePlus
} from 'lucide-react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Modal } from '../ui'
import { useIncidentes } from '../../hooks/useIncidentes'
import { useIncidenteNotas } from '../../hooks/useIncidenteNotas'
import { useIncidenteNotasUsuarias } from '../../hooks/useIncidenteNotasUsuarias'
import Swal from 'sweetalert2'

dayjs.extend(relativeTime)

export function IncidenteDetalles({ incident, open, onClose, onOpenNotes }) {
  const { closeIncident, archiveIncident, updateFaseRespuesta } =
    useIncidentes()
  const [faseRespuesta, setFaseRespuesta] = useState('Sin movimientos')
  const [faseRespuestaGuardada, setFaseRespuestaGuardada] =
    useState('Sin movimientos')
  const [loading, setLoading] = useState(false)
  const { notas, notasLoading } = useIncidenteNotas(incident?.folio)
  const { notasUsuaria, notasUsuariaLoading, notasUsuariaError } =
    useIncidenteNotasUsuarias(incident?.folio)

  useEffect(() => {
    if (incident) {
      const currentFase = incident.fase_respuesta || 'Sin movimientos'
      setFaseRespuesta(currentFase)
      setFaseRespuestaGuardada(currentFase)
    }
  }, [incident])

  if (!incident) return null

  const hasChanges = faseRespuesta !== faseRespuestaGuardada

  const formatUserNoteDate = (createdAt) => {
    const date = dayjs(createdAt)
    return date.isValid() ? date.format('DD/MM/YYYY HH:mm:ss') : 'Sin fecha'
  }

  const handleCloseDetails = () => {
    onClose()
  }

  const onSaveFase = async () => {
    setLoading(true)
    try {
      await updateFaseRespuesta(incident.folio, faseRespuesta)
      setFaseRespuestaGuardada(faseRespuesta)
      toast.success('Fase operativa actualizada')
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const darkSwal = Swal.mixin({
    background: '#1f2937',
    color: '#f3f4f6',
    confirmButtonColor: '#7c3aed',
    cancelButtonColor: '#ef4444'
  })

  const onCloseIncident = async (action = 'Cerrar') => {
    setLoading(true)

    darkSwal
      .fire({
        title: `¿${action === 'Cerrar' ? 'Finalizar' : 'Desharchivar'} incidente?`,
        text: `¿Confirma que desea ${action === 'Cerrar' ? 'finalizar' : 'desharchivar'} este incidente? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Sí, ${action === 'Cerrar' ? 'finalizar' : 'desharchivar'}`,
        cancelButtonText: 'No, cancelar'
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await closeIncident(incident.folio)
            toast.success('Incidente cerrado correctamente')
            handleCloseDetails()
          } catch (err) {
            console.error(err)
            toast.error('Error al cerrar incidente')
          } finally {
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      })
  }

  const onArchiveIncident = async () => {
    setLoading(true)
    darkSwal
      .fire({
        title: '¿Archivar incidente?',
        text: '¿Confirma que desea archivar este incidente? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, archivar',
        cancelButtonText: 'No, cancelar'
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await archiveIncident(incident.folio)
            toast.success('Incidente archivado correctamente')
            handleCloseDetails()
          } catch (err) {
            console.error(err)
            toast.error('Error al archivar incidente')
          } finally {
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      })
  }

  const markerIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  return (
    <>
      <Modal
        open={open}
        title={
          <div className='flex items-center gap-3'>
            <span className='text-purple-400 font-mono font-bold'>
              #{incident.folio}
            </span>
            <span className='text-gray-600'>|</span>
            <span className='text-sm font-medium text-gray-400'>
              Expediente de Atención
            </span>
          </div>
        }
        onClose={handleCloseDetails}
      >
        <div className='space-y-6'>
          {incident.estado === 'Activo' && (
            <div className='bg-red-900/30 border border-red-500/50 rounded-2xl p-4 flex items-center gap-4 animate-pulse'>
              <div className='bg-red-600 p-2 rounded-xl text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'>
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className='text-sm font-bold text-red-400 uppercase tracking-wide'>
                  Emergencia Activa
                </p>
                <p className='text-xs text-red-300 font-medium'>
                  Prioridad 1: Respuesta inmediata requerida.
                </p>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest ml-1'>
                Información de Usuaria
              </h3>
              <div className='bg-gray-800 rounded-2xl p-2 sm:p-5 border border-gray-700 space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-gray-900 rounded-xl border border-gray-600 flex items-center justify-center shrink-0 overflow-hidden text-purple-500'>
                    {incident.usuarias?.foto ? (
                      <img
                        src={incident.usuarias.foto}
                        alt={`Foto de ${incident.usuarias.nombre_completo} ${incident.usuarias.apellido_p} ${incident.usuarias.apellido_m}`}
                        className='w-full h-full rounded-xl object-cover'
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className='min-w-0'>
                    <p className='font-bold text-white'>
                      {incident.usuarias?.nombre_completo}{' '}
                      {incident.usuarias?.apellido_p}{' '}
                      {incident.usuarias?.apellido_m}
                    </p>
                    <p className='text-xs font-medium text-gray-400'>
                      ID: {incident.usuarias?.id?.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <div className='space-y-3 bg-gray-900 border border-gray-700 rounded-2xl p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-[10px] text-gray-400 uppercase tracking-wide font-bold block'>
                      Notas de la usuaria
                    </p>
                    <span className='text-[11px] font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-full px-3 py-1'>
                      {notasUsuaria.length}
                    </span>
                  </div>

                  {notasUsuariaLoading ? (
                    <div className='flex items-center justify-center gap-2 py-5 text-sm text-gray-500'>
                      <Loader2 className='w-4 h-4 animate-spin text-purple-400' />
                      Cargando notas...
                    </div>
                  ) : notasUsuariaError ? (
                    <div className='bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-sm text-red-300'>
                      {notasUsuariaError}
                    </div>
                  ) : notasUsuaria.length === 0 ? (
                    <div className='w-full bg-gray-800 rounded-lg p-3 text-xs text-gray-300 transition-all'>
                      No hay notas registradas.
                    </div>
                  ) : (
                    <div className='space-y-3 max-h-56 overflow-y-auto pr-1'>
                      {notasUsuaria.map((notaUsuaria) => (
                        <article
                          key={notaUsuaria.id}
                          className='bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-2'
                        >
                          <p className='text-sm text-gray-200 whitespace-pre-wrap break-words'>
                            {notaUsuaria.comentario}
                          </p>
                          <p className='inline-flex items-center gap-1.5 text-[11px] text-gray-500'>
                            <CalendarClock className='w-3.5 h-3.5 text-purple-400' />
                            {formatUserNoteDate(notaUsuaria.created_at)}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
                <div className='space-y-2 pt-2'>
                  <div className='flex items-center gap-3 text-sm text-gray-300'>
                    <Phone size={14} className='text-gray-500 shrink-0' />
                    <span className='font-semibold'>
                      {incident.usuarias?.telefono || 'Sin teléfono'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm text-gray-300'>
                    <Home size={14} className='text-gray-500 shrink-0' />
                    <span className='leading-tight'>
                      {incident.usuarias?.direccion ||
                        'Dirección no registrada'}
                    </span>
                  </div>
                </div>

                {incident.usuarias?.contactos_emergencia?.length > 0 && (
                  <div className='mt-3 pt-3 border-t border-gray-700'>
                    <p className='text-[10px] font-black text-amber-500 uppercase tracking-wide mb-2 flex items-center gap-1'>
                      <AlertTriangle size={10} /> Contactos de Emergencia
                    </p>
                    <div className='space-y-2'>
                      {incident.usuarias.contactos_emergencia.map(
                        (contacto) => (
                          <div
                            key={contacto.id}
                            className='bg-amber-900/20 border border-amber-500/30 rounded-lg p-2 flex justify-between items-center text-sm'
                          >
                            <span className='font-bold text-amber-400 flex items-center gap-1'>
                              <User size={12} /> {contacto.nombre_completo}
                            </span>
                            <a
                              href={`tel:${contacto.telefono}`}
                              className='flex items-center gap-1 text-amber-300 font-mono font-bold hover:underline'
                            >
                              <Phone size={12} /> {contacto.telefono}
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest ml-1'>
                Geolocalización
              </h3>
              <div className='bg-gray-800 rounded-2xl p-1 border border-gray-700'>
                <div className='relative w-full h-64 rounded-xl overflow-hidden shadow-inner border border-gray-600 z-0'>
                  <MapContainer
                    center={[
                      Number(incident.latitud),
                      Number(incident.longitud)
                    ]}
                    zoom={16}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' />

                    <Marker
                      position={[
                        Number(incident.latitud),
                        Number(incident.longitud)
                      ]}
                      icon={markerIcon}
                    >
                      <Popup
                        closeButton={false}
                        className='font-sans text-xs font-bold text-gray-900'
                      >
                        📍 Ubicación Reportada
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <a
                    href={`https://www.google.com/maps?q=${incident.latitud},${incident.longitud}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='absolute top-1 right-1 px-3 py-2 bg-gray-900/90 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg text-purple-400 text-xs font-bold hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2 z-[400]'
                  >
                    <Navigation size={14} /> Ver en Google Maps
                  </a>
                </div>

                <div className='p-4 flex justify-between items-center'>
                  <div>
                    <p className='text-[10px] font-bold text-gray-500 uppercase'>
                      Lat / Long
                    </p>
                    <p className='font-mono text-[11px] sm:text-sm font-bold text-white'>
                      {Number(incident.latitud).toFixed(6)},{' '}
                      {Number(incident.longitud).toFixed(6)}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-[10px] font-bold text-gray-500 uppercase'>
                      Precisión
                    </p>
                    <p className='text-xs font-bold text-white flex items-center gap-1 justify-end'>
                      {incident.precision_gps} m
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest ml-1'>
              Notas de seguimiento
            </h3>
            <div className='bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='flex items-start gap-3 min-w-0'>
                <div className='w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0'>
                  <MessageSquare size={18} />
                </div>
                <div className='min-w-0'>
                  <p className='text-[10px] text-gray-400 uppercase tracking-wide font-bold'>
                    Notas del operador
                  </p>
                  <p className='text-sm font-bold text-white'>
                    {notasLoading
                      ? 'Cargando notas...'
                      : `${notas.length} ${notas.length === 1 ? 'nota registrada' : 'notas registradas'}`}
                  </p>
                  {notas[0] && (
                    <p className='mt-2 text-xs text-gray-500 break-words'>
                      Última: {notas[0].comentario}
                    </p>
                  )}
                </div>
              </div>

              <button
                type='button'
                onClick={() => onOpenNotes?.(incident)}
                className='w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 text-gray-200 text-xs font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all border border-gray-600 hover:border-purple-500'
              >
                <MessageSquarePlus className='w-4 h-4' />
                Gestionar notas
              </button>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest ml-1'>
              Bitácora de Seguimiento
            </h3>
            <div className='space-y-4 bg-gray-900 border border-gray-700 rounded-2xl p-4'>
              <div>
                <label className='text-[10px] text-gray-400 uppercase tracking-wide font-bold mb-2 block'>
                  Fase de Respuesta Operativa
                </label>
                <select
                  value={faseRespuesta}
                  onChange={(e) => setFaseRespuesta(e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all appearance-none cursor-pointer'
                >
                  <option value='Sin movimientos'>Sin movimientos</option>
                  <option value='Unidad enviada: espera de seguimiento'>
                    Unidad enviada: espera de seguimiento
                  </option>
                  <option value='Unidad enviada: Falso positivo'>
                    Unidad enviada: Falso positivo
                  </option>
                  <option value='Unidad enviada: no se pudo contactar con la usuaria'>
                    Unidad enviada: no se pudo contactar con la usuaria
                  </option>
                  <option value='Unidad enviada: usuaria contactada y atendida'>
                    Unidad enviada: usuaria contactada y atendida
                  </option>
                  <option value='Estatus cerrado'>Estatus cerrado</option>
                </select>
              </div>

              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-gray-800'>
                <p className='text-[11px] text-gray-500 italic'>
                  La fase se guarda independiente de las notas.
                </p>
                <button
                  onClick={onSaveFase}
                  disabled={loading || !hasChanges}
                  className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-500 transition-all disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 border border-transparent disabled:border-gray-700'
                >
                  {loading ? (
                    <Loader2 className='w-3 h-3 animate-spin' />
                  ) : (
                    <Save className='w-3 h-3' />
                  )}
                  Guardar fase
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700'>
            {incident.estado === 'Atendido' && (
              <button
                onClick={() => onCloseIncident('Cerrar')}
                className='flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20'
              >
                <CheckCircle2 size={18} />
                Cerrar incidente
              </button>
            )}
            {incident.estado === 'Cerrado' && (
              <button
                onClick={onArchiveIncident}
                className='flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20'
              >
                <Archive size={18} />
                Archivar incidente
              </button>
            )}
            {incident.estado === 'Archivado' && (
              <button
                onClick={() => onCloseIncident('desharchivar')}
                className='flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2'
              >
                <CheckCircle2 size={18} />
                Desharchivar incidente
              </button>
            )}
            <button
              onClick={handleCloseDetails}
              className='px-6 py-3 bg-gray-800 border border-gray-600 text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-700 hover:text-white transition-all'
            >
              Regresar
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
