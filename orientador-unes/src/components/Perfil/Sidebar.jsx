import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Camera, Loader2, BookOpen, LogOut } from 'lucide-react'

export const Sidebar = ({
  formData,
  user,
  uploadingAvatar,
  handleAvatarChange,
  handleSignOut
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className='md:col-span-1'
    >
      <div className='bg-gray-800 rounded-2xl shadow-xl shadow-black/20 p-6 border border-gray-700'>
        <div className='flex flex-col items-center mb-6'>
          <div className='relative'>
            <div className='w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-gray-700'>
              {formData.foto ? (
                <img
                  src={formData.foto}
                  alt='Avatar'
                  className='w-full h-full object-cover'
                />
              ) : (
                <span>
                  {formData.nombre_completo?.charAt(0).toUpperCase() || 'U'}
                  {formData.apellido_p?.charAt(0).toUpperCase() || 'S'}
                  {formData.apellido_m?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <label
              htmlFor='avatar-upload'
              className='absolute bottom-0 right-0 w-10 h-10 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors hover:scale-105 border border-gray-700'
            >
              {uploadingAvatar ? (
                <Loader2 className='w-5 h-5 text-white animate-spin' />
              ) : (
                <Camera className='w-5 h-5 text-white' />
              )}
            </label>
            <input
              id='avatar-upload'
              type='file'
              accept='image/*'
              onChange={handleAvatarChange}
              className='hidden'
              disabled={uploadingAvatar}
            />
          </div>
          <h3 className='mt-4 text-xl font-semibold text-white text-center leading-tight'>
            {formData?.nombre_completo} {formData?.apellido_p}{' '}
            {formData?.apellido_m}
          </h3>
          <p className='text-sm text-gray-400 text-center mt-1'>{user.email}</p>

          <span className='mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider'>
            <ShieldCheck className='w-3 h-3' />
            Cuenta UNES
          </span>
        </div>

        <Link
          to='/mi-orientacion'
          className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-900/20 text-blue-400 border border-blue-500/20 font-bold hover:bg-blue-900/40 hover:border-blue-500/40 transition-colors mb-3'
        >
          <BookOpen className='w-5 h-5' />
          <span className='font-medium'>Mi orientacion</span>
        </Link>

        <button
          onClick={handleSignOut}
          className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 text-red-400 border border-red-500/20 font-bold hover:bg-red-900/40 hover:border-red-500/40 transition-colors'
        >
          <LogOut className='w-5 h-5' />
          <span className='font-medium'>Cerrar sesion</span>
        </button>
      </div>
    </motion.div>
  )
}
