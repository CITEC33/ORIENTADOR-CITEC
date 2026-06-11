import { Loader2, ShieldCheck } from 'lucide-react'

export const Form = ({
  handleSubmit,
  isEditing,
  formData,
  setFormData,
  setShowModal,
  processing
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-5 h-full flex flex-col justify-between'
    >
      {!isEditing && (
        <div className='p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl flex gap-3 text-sm text-blue-300'>
          <ShieldCheck className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400' />
          <p className='text-xs sm:text-base'>
            Este usuario tendrá acceso completo al panel de control, gestión de
            incidentes y base de datos de usuarias.
          </p>
        </div>
      )}

      <div className='space-y-4'>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-gray-400 uppercase ml-1'>
            Nombre Completo
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Ej. Roberto Gómez'
            className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 font-medium text-gray-200 placeholder-gray-600'
            required
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-gray-400 uppercase ml-1'>
            Correo
          </label>
          <input
            type='email'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder='admin@institucion.gob.mx'
            className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 font-medium text-gray-200 placeholder-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed'
            required
            disabled={isEditing}
          />
        </div>

        {!isEditing && (
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-400 uppercase ml-1'>
              Contraseña
            </label>
            <input
              type='password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder='Mínimo 6 caracteres'
              className='w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 font-medium text-gray-200 placeholder-gray-600'
              required
            />
          </div>
        )}
      </div>

      <div
        className={`flex gap-3 pt-4 border-t border-gray-700 ${isEditing ? '' : 'pb-4'}`}
      >
        <button
          type='button'
          onClick={() => setShowModal(false)}
          className='flex-1 py-2.5 text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors border border-gray-600'
        >
          Cancelar
        </button>
        <button
          type='submit'
          disabled={processing}
          className='flex-1 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 border border-purple-500'
        >
          {processing ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : isEditing ? (
            'Guardar cambios'
          ) : (
            'Crear admin'
          )}
        </button>
      </div>
    </form>
  )
}
