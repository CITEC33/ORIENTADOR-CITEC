import { Loader2, UploadCloud } from 'lucide-react'
import { useMemo, useEffect } from 'react'

export const Form = ({
  formData,
  saving,
  editingId,
  setFormData,
  setShowModal,
  onSubmit
}) => {
  const preview = useMemo(() => {
    if (!formData.imagen) return null

    if (formData.imagen instanceof File) {
      return URL.createObjectURL(formData.imagen)
    }

    return formData.imagen
  }, [formData.imagen])

  useEffect(() => {
    return () => {
      if (formData.imagen instanceof File && preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [formData.imagen, preview])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, imagen: file })
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-5'>
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Imagen de Portada
        </label>

        <div className='relative group w-full h-48 bg-gray-900 border-2 border-dashed border-gray-600 rounded-xl overflow-hidden hover:border-purple-500 transition-colors cursor-pointer'>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
          />

          {preview ? (
            <img
              src={preview}
              alt='Preview'
              className='w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity'
            />
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-purple-400 transition-colors'>
              <UploadCloud className='w-8 h-8 mb-2' />
              <span className='text-xs font-medium'>
                Haz clic para subir una imagen
              </span>
            </div>
          )}

          <div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
            <span className='text-white text-xs font-bold bg-gray-800/80 border border-gray-600 px-3 py-1 rounded-full'>
              Cambiar imagen
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Título del Artículo
        </label>
        <input
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder='Ej. Guía de Prevención...'
          className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-bold text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Concepto Clave (Breve concepto del articulo)
        </label>
        <input
          value={formData.concepto_clave}
          onChange={(e) =>
            setFormData({ ...formData, concepto_clave: e.target.value })
          }
          placeholder='Ej. La violencia de género es cuando...'
          className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Descripción Corta (Resumen)
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          placeholder='Breve introducción que aparecerá en la tarjeta...'
          rows={2}
          className='w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm leading-relaxed text-gray-200 placeholder-gray-600'
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-gray-400 uppercase'>
          Contenido Completo
        </label>
        <p className='text-[11px] text-gray-400 mb-1'>
          Los saltos de línea se guardarán automáticamente.
        </p>
        <textarea
          value={formData.contenido}
          onChange={(e) =>
            setFormData({ ...formData, contenido: e.target.value })
          }
          placeholder='Escribe aquí el cuerpo completo del artículo...'
          rows={8}
          className='w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm leading-relaxed font-mono whitespace-pre-wrap text-gray-300 placeholder-gray-600'
          required
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
            'Publicar artículo'
          )}
        </button>
      </div>
    </form>
  )
}
