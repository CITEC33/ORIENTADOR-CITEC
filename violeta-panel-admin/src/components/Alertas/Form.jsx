import { Clock, Loader2, AlertTriangle } from 'lucide-react'

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
          Título de la alerta
        </label>
        <input
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder='Ej. Hay multiples casos de acoso...'
          className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Nivel de prioridad
        </label>
        <div className='grid grid-cols-3 gap-2'>
          {['Alta', 'Media', 'Baja'].map((level) => (
            <button
              key={level}
              type='button'
              onClick={() => setFormData({ ...formData, prioridad: level })}
              className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                formData.prioridad === level
                  ? level === 'Alta'
                    ? 'bg-red-900/40 border-red-500 text-red-400 ring-1 ring-red-500 shadow-lg shadow-red-900/20'
                    : level === 'Media'
                      ? 'bg-orange-900/40 border-orange-500 text-orange-400 ring-1 ring-orange-500 shadow-lg shadow-orange-900/20'
                      : 'bg-purple-900/40 border-purple-500 text-purple-400 ring-1 ring-purple-500 shadow-lg shadow-purple-900/20'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Descripción detallada
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          placeholder='Escribe los detalles de la alerta...'
          rows={4}
          className='w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm leading-relaxed text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5 p-4 bg-gray-900/50 rounded-xl border border-dashed border-gray-600'>
        <label className='text-xs font-bold text-gray-400 uppercase flex items-center gap-2'>
          <Clock className='w-3 h-3 text-purple-400' />
          Fecha de expiración (Opcional)
        </label>
        <p className='text-[11px] text-gray-400 mb-2'>
          La alerta dejará de ser visible después de esta fecha.
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

      <div className='flex gap-3 pt-2 border-t border-gray-700 mt-4'>
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
            'Publicar alerta'
          )}
        </button>
      </div>
    </form>
  )
}
