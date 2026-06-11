import {
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useLogin } from '../../hooks/useLogin'

export const LoginForm = () => {
  const {
    error,
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading
  } = useLogin()
  return (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 p-3 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-start gap-3'
        >
          <AlertCircle className='text-red-600 w-5 h-5 flex-shrink-0 mt-0.5' />
          <div className='text-sm text-red-700 font-medium'>{error}</div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className='space-y-5'>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider'>
            Correo Electrónico
          </label>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Mail className='h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors' />
            </div>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder='admin@dmsp.gob.mx'
              className='block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium font-mono text-sm'
            />
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider'>
            Contraseña
          </label>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Lock className='h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors' />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder='••••••••••••'
              className='block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium font-mono text-sm'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 outline-none'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full mt-4 group relative flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 font-bold text-sm tracking-wide shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden'
        >
          <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer' />

          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span>Cargando...</span>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span>Iniciar sesión</span>
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform opacity-70' />
            </div>
          )}
        </button>
      </form>
    </>
  )
}
