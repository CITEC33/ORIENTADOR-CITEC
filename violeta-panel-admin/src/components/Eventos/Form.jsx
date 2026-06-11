import { Clock, Loader2, MapPin } from 'lucide-react'

export const Form = ({
  formData,
  saving,
  editingId,
  setFormData,
  setShowModal,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className='space-y-5'>
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Título del Evento
        </label>
        <input
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder='Ej. Reunión Vecinal...'
          className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Lugar / Ubicación
        </label>
        <div className='relative'>
          <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
          <input
            value={formData.lugar}
            onChange={(e) =>
              setFormData({ ...formData, lugar: e.target.value })
            }
            placeholder='Ej. Plaza de Armas, Salón Comunal...'
            className='w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-gray-200 placeholder-gray-600'
            required
          />
        </div>
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Fecha y Hora del Evento
        </label>
        <input
          type='datetime-local'
          value={formData.fecha_hora}
          onChange={(e) =>
            setFormData({ ...formData, fecha_hora: e.target.value })
          }
          className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-gray-200'
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Descripción
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          placeholder='Detalles importantes...'
          rows={4}
          className='w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm leading-relaxed text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5 p-4 bg-gray-900/50 rounded-xl border border-dashed border-gray-600'>
        <label className='text-xs font-bold text-gray-400 uppercase flex items-center gap-2'>
          <Clock className='w-3 h-3 text-purple-400' />
          Fecha de Expiración (Opcional)
        </label>
        <p className='text-[11px] text-gray-400 mb-2'>
          El evento dejará de ser visible para los usuarios después de esta
          fecha.
        </p>
        <input
          type='datetime-local'
          value={formData.fecha_expiracion}
          onChange={(e) =>
            setFormData({ ...formData, fecha_expiracion: e.target.value })
          }
          className='w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-gray-300'
        />
      </div>

      <div className='flex gap-3 pt-2'>
        <button
          type='button'
          onClick={() => setShowModal(false)}
          className='flex-1 py-3 text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors border border-gray-600'
        >
          Cancelar
        </button>
        <button
          type='submit'
          disabled={saving}
          className='flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 border border-purple-500'
        >
          {saving ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : editingId ? (
            'Guardar cambios'
          ) : (
            'Publicar evento'
          )}
        </button>
      </div>
    </form>
  )
}
