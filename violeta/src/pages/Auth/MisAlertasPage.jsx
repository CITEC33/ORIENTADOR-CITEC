import {
  AlertTriangle,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  Loader2,
  X,
  Save,
  MessageSquarePlus,
  Pencil,
  Plus
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { RefreshWrapper } from '../../components/RefreshWrapper'
import { useIncidentes } from '../../hooks/useIncidentes'

const MisAlertasPage = () => {
  const {
    incidentes,
    isLoading,
    crearNotaUsuaria,
    actualizarNotaUsuaria,
    isSavingNota
  } = useIncidentes()
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [nota, setNota] = useState('')
  const [editingNote, setEditingNote] = useState(null)

  useEffect(() => {
    document.title = 'Mis Alertas - Fuerza Violeta'
  }, [])

  const getStatusBadge = (estado) => {
    const config = {
      Activo: {
        bg: 'bg-red-900/30',
        text: 'text-red-400',
        border: 'border-red-500/50',
        icon: AlertTriangle,
        label: 'Activo'
      },
      Atendido: {
        bg: 'bg-amber-900/30',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        icon: Clock,
        label: 'Atendido'
      },
      Cerrado: {
        bg: 'bg-emerald-900/30',
        text: 'text-emerald-400',
        border: 'border-emerald-500/50',
        icon: CheckCircle,
        label: 'Cerrado'
      },
      Archivado: {
        bg: 'bg-gray-700/50',
        text: 'text-gray-400',
        border: 'border-gray-600',
        icon: CheckCircle,
        label: 'Archivado'
      }
    }

    const {
      bg,
      text,
      border,
      icon: Icon,
      label
    } = config[estado] || config['Activo']

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${bg} ${text} ${border} shadow-sm`}
      >
        <Icon className='w-3.5 h-3.5' />
        {label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  const getAdminNotes = (incident) =>
    [...(incident?.notas_admin || [])]
      .filter((adminNote) => adminNote?.comentario?.trim())
      .sort((a, b) => {
        const aDate = getAdminNoteDate(a)
        const bDate = getAdminNoteDate(b)
        return bDate - aDate
      })

  const getUserNotes = (incident) =>
    [...(incident?.notas_usuaria || [])]
      .filter((userNote) => userNote?.comentario?.trim())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const getAdminNoteDate = (adminNote) => {
    if (!adminNote?.fecha) return new Date(0)
    const [year, month, day] = adminNote.fecha.split('-').map(Number)
    const [hour = 0, minute = 0, second = 0] = (adminNote.hora || '')
      .split(':')
      .map(Number)
    return new Date(year, month - 1, day, hour, minute, second)
  }

  const getConversationNotes = (incident) => {
    const adminNotes = getAdminNotes(incident).map((adminNote) => ({
      id: `admin-${adminNote.id}`,
      author: 'admin',
      comentario: adminNote.comentario,
      date: getAdminNoteDate(adminNote)
    }))

    const userNotes = getUserNotes(incident).map((userNote) => ({
      id: `usuaria-${userNote.id}`,
      author: 'usuaria',
      comentario: userNote.comentario,
      date: new Date(userNote.created_at)
    }))

    return [...adminNotes, ...userNotes].sort((a, b) => b.date - a.date)
  }

  const openNoteModal = (incident) => {
    setSelectedIncident(incident)
    setNota('')
    setEditingNote(null)
  }

  const closeNoteModal = () => {
    setSelectedIncident(null)
    setNota('')
    setEditingNote(null)
  }

  const handleEditNote = (userNote) => {
    setEditingNote(userNote)
    setNota(userNote.comentario)
  }

  const handleIncidentKeyDown = (event, incident) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openNoteModal(incident)
    }
  }

  const handleSaveNote = async (event) => {
    event.preventDefault()

    if (!selectedIncident) return

    const comentario = nota.trim()

    if (!comentario) {
      toast.error('Escribe una nota antes de guardar')
      return
    }

    try {
      if (editingNote) {
        await actualizarNotaUsuaria({
          id: editingNote.id,
          comentario
        })
        toast.success('Nota actualizada correctamente')
      } else {
        await crearNotaUsuaria({
          folio: selectedIncident.folio,
          comentario
        })
        toast.success('Nota agregada correctamente')
      }

      setNota('')
      setEditingNote(null)
    } catch (error) {
      console.error('Error al guardar la nota', error)
      toast.error('No se pudo guardar la nota')
    }
  }

  const renderIncidentNotes = (incident) => {
    const conversationNotes = getConversationNotes(incident)

    if (conversationNotes.length === 0) return null

    return (
      <div className='border-t border-gray-700/70 pt-4'>
        <div className='mb-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3'>
          <p className='text-[11px] font-bold uppercase tracking-wider text-gray-500'>
            Conversación del expediente
          </p>
          <span className='rounded-full border border-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-500'>
            {conversationNotes.length}{' '}
            {conversationNotes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>

        <div className='max-h-72 space-y-3 overflow-y-auto pr-1'>
          {conversationNotes.map((conversationNote) => {
            const isUserNote = conversationNote.author === 'usuaria'

            return (
              <div
                key={conversationNote.id}
                className={`flex ${
                  isUserNote ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUserNote
                      ? 'rounded-br-md border border-purple-500/30 bg-purple-950/30'
                      : 'rounded-bl-md border border-gray-700 bg-gray-900/70'
                  }`}
                >
                  <p
                    className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${
                      isUserNote ? 'text-purple-300/80' : 'text-gray-500'
                    }`}
                  >
                    {isUserNote ? 'Tú' : 'Autoridades'}
                  </p>
                  <p className='whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-200'>
                    {conversationNote.comentario}
                  </p>
                  <p className='mt-2 text-[11px] font-medium text-gray-500'>
                    {formatDate(conversationNote.date)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderUserNotesModalSection = (incident) => {
    const userNotes = getUserNotes(incident)

    return (
      <div className='rounded-xl border border-gray-700 bg-gray-950/40 p-4'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <p className='text-xs font-bold uppercase tracking-wider text-gray-500'>
            Tus notas anteriores
          </p>
          <span className='rounded-full border border-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-500'>
            {userNotes.length} {userNotes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>

        {userNotes.length === 0 ? (
          <p className='text-sm text-gray-500'>
            Aún no has agregado notas a esta alerta.
          </p>
        ) : (
          <div className='max-h-56 space-y-2 overflow-y-auto pr-1'>
            {userNotes.map((userNote) => (
              <button
                key={userNote.id}
                type='button'
                onClick={() => handleEditNote(userNote)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  editingNote?.id === userNote.id
                    ? 'border-purple-500/60 bg-purple-950/30'
                    : 'border-gray-700 bg-gray-900/60 hover:border-purple-500/40 hover:bg-gray-900'
                }`}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300'>
                      {userNote.comentario}
                    </p>
                    <p className='mt-2 text-[11px] font-medium text-gray-500'>
                      {formatDate(userNote.created_at)}
                    </p>
                  </div>
                  <Pencil className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500' />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const activeIncident = selectedIncident
    ? incidentes.find(
        (incident) => incident.folio === selectedIncident.folio
      ) || selectedIncident
    : null

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' />
      </div>
    )
  }

  return (
    <RefreshWrapper>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-4 md:p-8 mt-12 lg:mt-0'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-3xl font-black text-white mb-2 tracking-tight'>
              Mis Alertas
            </h1>
            <p className='text-gray-400 font-medium'>
              Historial completo de tus activaciones de emergencia
            </p>
            <p className='mt-3 max-w-2xl text-xs leading-relaxed text-gray-500'>
              Puedes abrir cualquiera de tus alertas para agregar una nota si
              deseas proporcionar información adicional sobre el caso.
            </p>
          </div>

          {incidentes.length === 0 ? (
            <div className='bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/20 border border-gray-700 p-16 text-center'>
              <div className='bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700'>
                <AlertTriangle className='w-10 h-10 text-gray-600' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>
                Sin actividad reciente
              </h3>
              <p className='text-gray-400 max-w-sm mx-auto'>
                Afortunadamente no has tenido necesidad de activar el botón SOS.
                Tu historial aparecerá aquí cuando lo uses.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {incidentes.map((incident) => (
                <div
                  key={incident.folio}
                  tabIndex={0}
                  onKeyDown={(event) => handleIncidentKeyDown(event, incident)}
                  className='bg-gray-800 rounded-2xl shadow-lg shadow-black/20 border border-gray-700 p-6 hover:border-purple-500/30 transition-all duration-300 group focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-gray-900'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-700 pb-4'>
                    <div>
                      <p className='text-center text-xs bg-violet-300/20 text-violet-400 font-bold px-2 py-1 rounded-lg border border-violet-500/50 shadow-sm mb-2'>
                        {incident.fase_respuesta}
                      </p>
                      <p className='text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1'>
                        Folio de expediente
                      </p>
                      <p className='font-mono font-bold text-xl text-white'>
                        #{incident.folio}
                      </p>
                    </div>
                    {getStatusBadge(incident.estado)}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div className='flex items-start gap-3'>
                      <div className='p-2 bg-purple-900/30 rounded-lg text-purple-400 ring-1 ring-purple-500/20'>
                        <Calendar className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='text-xs font-bold text-gray-500 uppercase'>
                          Fecha de activación
                        </p>
                        <p className='text-sm font-semibold text-gray-200 mt-1'>
                          {formatDate(incident.fecha_activacion)}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='p-2 bg-pink-900/30 rounded-lg text-pink-400 ring-1 ring-pink-500/20'>
                        <MapPin className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='text-xs font-bold text-gray-500 uppercase'>
                          Ubicación registrada
                        </p>
                        <p className='text-sm font-mono font-medium text-gray-200 mt-1'>
                          {Number(incident.latitud).toFixed(5)},{' '}
                          {Number(incident.longitud).toFixed(5)}
                        </p>
                        <p className='text-[10px] text-gray-500 mt-1'>
                          Precisión: ±{incident.precision_gps}m
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='p-2 bg-purple-900/30 rounded-lg text-purple-400 ring-1 ring-purple-500/20'>
                        <Clock className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='text-xs font-bold text-gray-500 uppercase'>
                          Ultima actualización
                        </p>
                        <p className='text-sm font-semibold text-gray-200 mt-1'>
                          {formatDate(incident.fecha_actualizacion)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(incident.fecha_atencion || incident.fecha_cerrado) && (
                    <div className='mt-6 bg-gray-900/50 rounded-xl p-4 space-y-3 border border-gray-700/50'>
                      {incident.fecha_atencion && (
                        <div className='flex items-center gap-3 text-sm'>
                          <CheckCircle className='w-4 h-4 text-amber-500 flex-shrink-0' />
                          <span className='text-gray-400'>
                            <span className='font-bold text-gray-300'>
                              Atendido:
                            </span>{' '}
                            {formatDate(incident.fecha_atencion)}
                          </span>
                        </div>
                      )}
                      {incident.fecha_cerrado && (
                        <div className='flex items-center gap-3 text-sm'>
                          <CheckCircle className='w-4 h-4 text-emerald-500 flex-shrink-0' />
                          <span className='text-gray-400'>
                            <span className='font-bold text-gray-300'>
                              Cerrado:
                            </span>{' '}
                            {formatDate(incident.fecha_cerrado)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => openNoteModal(incident)}
                    className='bg-purple-600 px-2 py-1.5 rounded-lg inline-flex items-center gap-1 text-white text-xs font-bold transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 group-focus:ring-purple-500/50 mb-3 mt-5'
                  >
                    <MessageSquarePlus className='w-4 h-4 text-white transition-colors' />
                    Agregar nota
                  </button>

                  {renderIncidentNotes(incident)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeIncident && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-black/80 backdrop-blur-sm'
            onClick={closeNoteModal}
          />

          <form
            onSubmit={handleSaveNote}
            className='relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl shadow-black animate-in fade-in zoom-in duration-200'
          >
            <div className='flex items-center justify-between gap-4 border-b border-gray-700 bg-gray-800 px-6 py-4'>
              <div>
                <h2 className='text-lg font-bold text-white'>
                  {editingNote ? 'Editar nota' : 'Notas de alerta'}
                </h2>
                <p className='mt-1 font-mono text-xs font-semibold text-gray-500'>
                  #{activeIncident.folio}
                </p>
              </div>

              <button
                type='button'
                onClick={closeNoteModal}
                className='rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white'
                aria-label='Cerrar modal de nota'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='flex-1 space-y-4 overflow-y-auto p-6'>
              <div>
                <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                  <label
                    htmlFor='incident-note'
                    className='block text-xs font-bold uppercase text-gray-500'
                  >
                    {editingNote ? 'Editar nota seleccionada' : 'Nueva nota'}
                  </label>

                  {editingNote && (
                    <button
                      type='button'
                      onClick={() => {
                        setEditingNote(null)
                        setNota('')
                      }}
                      className='text-xs font-bold text-purple-300 transition-colors hover:text-purple-200'
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
                <textarea
                  id='incident-note'
                  value={nota}
                  onChange={(event) => setNota(event.target.value)}
                  rows={4}
                  autoFocus
                  placeholder='Agrega información adicional para complementar tu caso.'
                  className='w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm leading-relaxed text-gray-100 outline-none transition-colors placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                />
              </div>

              {renderUserNotesModalSection(activeIncident)}

              <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                <button
                  type='button'
                  onClick={closeNoteModal}
                  className='rounded-xl bg-gray-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-600'
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  disabled={isSavingNota}
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none'
                >
                  {isSavingNota ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingNote ? (
                        <Save className='h-4 w-4' />
                      ) : (
                        <Plus className='h-4 w-4' />
                      )}
                      {editingNote ? 'Actualizar nota' : 'Agregar nota'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </RefreshWrapper>
  )
}

export default MisAlertasPage
