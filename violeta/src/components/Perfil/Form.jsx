import { motion } from 'framer-motion'
import {
  User,
  Mail,
  MapPin,
  Phone,
  AlertCircle,
  UserPlus,
  Save,
  Loader2
} from 'lucide-react'

export const Form = ({
  handleSubmit,
  formData,
  handleChange,
  user,
  emergencyContacts,
  handleContactChange,
  saving
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className='md:col-span-2'
    >
      <form
        onSubmit={handleSubmit}
        className='bg-gray-800 rounded-2xl shadow-xl shadow-black/20 p-3 sm:p-6 border border-gray-700'
      >
        <div className='space-y-8'>
          <div>
            <h2 className='text-lg font-bold text-white mb-5 flex items-center gap-2 pb-2 border-b border-gray-700'>
              <User className='w-5 h-5 text-purple-400' />
              Información Personal
            </h2>
            <div className='grid gap-5'>
              <div>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
                  Nombre Completo
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                  <input
                    type='text'
                    name='nombre_completo'
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    required
                    className='w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:bg-gray-800 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-gray-200 outline-none placeholder-gray-600'
                    placeholder='Tu nombre completo'
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
                    Apellido paterno
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                    <input
                      type='text'
                      name='apellido_p'
                      value={formData.apellido_p}
                      onChange={handleChange}
                      required
                      className='w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:bg-gray-800 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-gray-200 outline-none placeholder-gray-600'
                      placeholder='Tu apellido paterno'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
                    Apellido materno
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600' />
                    <input
                      type='text'
                      name='apellido_m'
                      value={formData.apellido_m}
                      onChange={handleChange}
                      required
                      className='w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:bg-gray-800 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-gray-200 outline-none placeholder-gray-600'
                      placeholder='Tu apellido materno'
                    />
                  </div>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
                    Teléfono Móvil
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                    <input
                      type='tel'
                      name='telefono'
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className='w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:bg-gray-800 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-gray-200 outline-none placeholder-gray-600'
                      placeholder='618 000 0000'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
                    Correo Electrónico
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600' />
                    <input
                      type='email'
                      value={user.email}
                      disabled
                      className='w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-500 font-medium cursor-not-allowed select-none'
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>
                  Dirección de Domicilio
                </label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-4 w-5 h-5 text-gray-500' />
                  <textarea
                    name='direccion'
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    rows={2}
                    className='w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:bg-gray-800 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-gray-200 outline-none resize-none leading-relaxed placeholder-gray-600'
                    placeholder='Calle, Número, Colonia, Ciudad...'
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-lg font-bold text-white mb-5 flex items-center gap-2 pb-2 border-b border-gray-700'>
              <AlertCircle className='w-5 h-5 text-red-500' />
              Contactos de Emergencia
            </h2>

            <div className='mb-4 p-5 bg-red-900/10 rounded-xl border border-red-900/30 shadow-inner'>
              <h3 className='text-sm font-bold text-red-400 mb-3 flex items-center gap-2 uppercase tracking-wide'>
                <UserPlus className='w-4 h-4' />
                Contacto Principal
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-xs font-bold text-red-300/70 mb-1 ml-1'>
                    Nombre
                  </label>
                  <input
                    type='text'
                    value={emergencyContacts[0].nombre_completo}
                    onChange={(e) =>
                      handleContactChange(0, 'nombre_completo', e.target.value)
                    }
                    required
                    className='w-full px-4 py-2.5 bg-gray-900 border border-red-900/50 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-gray-200 outline-none transition-all placeholder-gray-600'
                    placeholder='Nombre familiar o amigo'
                  />
                </div>
                <div>
                  <label className='block text-xs font-bold text-red-300/70 mb-1 ml-1'>
                    Teléfono
                  </label>
                  <input
                    type='tel'
                    value={emergencyContacts[0].telefono}
                    onChange={(e) =>
                      handleContactChange(0, 'telefono', e.target.value)
                    }
                    required
                    className='w-full px-4 py-2.5 bg-gray-900 border border-red-900/50 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-gray-200 outline-none transition-all placeholder-gray-600'
                    placeholder='618 000 0000'
                  />
                </div>
              </div>
            </div>

            <div className='p-5 bg-orange-900/10 rounded-xl border border-orange-900/30 shadow-inner'>
              <h3 className='text-sm font-bold text-orange-400 mb-3 flex items-center gap-2 uppercase tracking-wide'>
                <UserPlus className='w-4 h-4' />
                Contacto Secundario (Opcional)
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-xs font-bold text-orange-300/70 mb-1 ml-1'>
                    Nombre
                  </label>
                  <input
                    type='text'
                    value={emergencyContacts[1].nombre_completo}
                    onChange={(e) =>
                      handleContactChange(1, 'nombre_completo', e.target.value)
                    }
                    className='w-full px-4 py-2.5 bg-gray-900 border border-orange-900/50 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-gray-200 outline-none transition-all placeholder-gray-600'
                    placeholder='Nombre familiar o amigo'
                  />
                </div>
                <div>
                  <label className='block text-xs font-bold text-orange-300/70 mb-1 ml-1'>
                    Teléfono
                  </label>
                  <input
                    type='tel'
                    value={emergencyContacts[1].telefono}
                    onChange={(e) =>
                      handleContactChange(1, 'telefono', e.target.value)
                    }
                    className='w-full px-4 py-2.5 bg-gray-900 border border-orange-900/50 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-gray-200 outline-none transition-all placeholder-gray-600'
                    placeholder='618 000 0000'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='pt-4'>
            <button
              type='submit'
              disabled={saving}
              className='w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-900/40 transform active:scale-[0.99]'
            >
              {saving ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span>Guardando cambios...</span>
                </>
              ) : (
                <>
                  <Save className='w-5 h-5' />
                  <span>Guardar Información</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
