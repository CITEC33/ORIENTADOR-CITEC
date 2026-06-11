import { useState } from 'react'
import dayjs from 'dayjs'
import {
  CalendarClock,
  Edit3,
  Loader2,
  MessageSquarePlus,
  Plus,
  Save,
  User
} from 'lucide-react'
import { toast } from 'sonner'
import { Modal, Textarea } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { useIncidenteNotas } from '../../hooks/useIncidenteNotas'

export function IncidenteNotasModal({ incident, open, onClose }) {
  const { user } = useAuth()
  const [noteText, setNoteText] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const {
    notas,
    notasLoading,
    notasError,
    savingNota,
    createNota,
    updateNota
  } = useIncidenteNotas(incident?.folio)

  const handleClose = () => {
    setNoteText('')
    setEditingNote(null)
    onClose?.()
  }

  const onSubmitNote = async (event) => {
    event.preventDefault()

    const comentario = noteText.trim()
    if (!comentario) {
      toast.error('Escribe una nota antes de guardarla')
      return
    }

    if (!user?.id) {
      toast.error('No se pudo identificar al administrador de la sesión')
      return
    }

    try {
      if (editingNote) {
        await updateNota(editingNote.id, comentario, user.id)
        toast.success('Nota guardada')
      } else {
        await createNota(comentario, user.id)
        toast.success('Nota agregada')
      }

      setNoteText('')
      setEditingNote(null)
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar la nota')
    }
  }

  const onEditNote = (nota) => {
    setEditingNote(nota)
    setNoteText(nota.comentario || '')
  }

  const cancelEditNote = () => {
    setEditingNote(null)
    setNoteText('')
  }

  const formatNoteDate = (nota) => {
    const fallback = [nota.fecha, nota.hora].filter(Boolean).join(' ')
    const dateValue = nota.fecha
      ? dayjs(`${nota.fecha}T${nota.hora || '00:00:00'}`)
      : null

    return dateValue?.isValid()
      ? dateValue.format('DD/MM/YYYY HH:mm')
      : fallback
  }

  const getNoteUserName = (nota) =>
    nota.administrador?.nombre ||
    nota.administrador_id?.slice(0, 8) ||
    'Administrador no identificado'

  return (
    <Modal
      open={open && Boolean(incident)}
      onClose={handleClose}
      size='md'
      title={
        <div className='flex items-center gap-2'>
          <MessageSquarePlus className='w-5 h-5 text-purple-400' />
          <span>Notas de seguimiento</span>
          {incident?.folio && (
            <span className='text-sm font-mono text-purple-300'>
              #{incident.folio}
            </span>
          )}
        </div>
      }
    >
      <div className='space-y-5'>
        <form onSubmit={onSubmitNote} className='space-y-3'>
          <div className='space-y-2'>
            <label className='text-[10px] text-gray-400 uppercase tracking-wide font-bold block'>
              {editingNote ? 'Editar nota' : 'Nueva nota'}
            </label>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder='Describa las acciones tomadas, unidad asignada o seguimiento...'
              className='min-h-[110px] bg-gray-800'
              autoFocus
            />
          </div>

          <div className='flex flex-col sm:flex-row justify-end gap-3'>
            {editingNote && (
              <button
                type='button'
                onClick={cancelEditNote}
                className='w-full sm:w-auto px-4 py-2 text-xs font-bold text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors border border-gray-600'
              >
                Cancelar edición
              </button>
            )}
            <button
              type='submit'
              disabled={savingNota || !noteText.trim()}
              className='w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-500 transition-all disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 border border-transparent disabled:border-gray-700'
            >
              {savingNota ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : editingNote ? (
                <Save className='w-3 h-3' />
              ) : (
                <Plus className='w-3 h-3' />
              )}
              {editingNote ? 'Guardar nota' : 'Agregar nota'}
            </button>
          </div>
        </form>

        <div className='pt-4 border-t border-gray-700 space-y-3'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest'>
              Notas agregadas
            </h3>
            <span className='text-[11px] font-bold text-gray-400 bg-gray-900 border border-gray-700 rounded-full px-3 py-1'>
              {notas.length}
            </span>
          </div>

          {notasLoading ? (
            <div className='flex items-center justify-center gap-2 py-8 text-sm text-gray-500'>
              <Loader2 className='w-4 h-4 animate-spin text-purple-400' />
              Cargando notas...
            </div>
          ) : notasError ? (
            <div className='bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-sm text-red-300'>
              {notasError}
            </div>
          ) : notas.length === 0 ? (
            <div className='bg-gray-900 border border-gray-700 rounded-xl p-6 text-center text-sm text-gray-500'>
              No hay notas agregadas para este incidente.
            </div>
          ) : (
            <div className='space-y-3 max-h-[360px] overflow-y-auto pr-1'>
              {notas.map((nota) => (
                <article
                  key={nota.id}
                  className='bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3'
                >
                  <p className='text-sm text-gray-200 whitespace-pre-wrap break-words'>
                    {nota.comentario}
                  </p>

                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <div className='flex flex-wrap items-center gap-3 text-[11px] text-gray-500'>
                      <span className='inline-flex items-center gap-1'>
                        <CalendarClock className='w-3.5 h-3.5 text-purple-400' />
                        {formatNoteDate(nota)}
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <User className='w-3.5 h-3.5 text-purple-400' />
                        {getNoteUserName(nota)}
                      </span>
                    </div>

                    <button
                      type='button'
                      onClick={() => onEditNote(nota)}
                      className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-purple-300 bg-purple-900/20 border border-purple-500/30 rounded-lg hover:bg-purple-600 hover:text-white transition-all'
                    >
                      <Edit3 className='w-3 h-3' />
                      Editar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
