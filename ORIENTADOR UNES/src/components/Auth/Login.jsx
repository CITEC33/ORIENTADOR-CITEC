import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import logo_durango from '../../assets/imgs/logo-unes.png'
import logo from '../../assets/imgs/quila-avatar.png'

export const Login = ({ onChange }) => {
  const navigate = useNavigate()
  const { user, loading, signIn } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        setError('Credenciales invalidas.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Ocurrio un error inesperado')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900'>
        <Loader2 className='w-12 h-12 text-violet-500 animate-spin' />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className='flex justify-center'
    >
      <div className='w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative'>
        <div className='h-2 w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600'></div>

        <div className='p-4 sm:p-8 md:p-10'>
          <div className='lg:hidden text-center mb-8'>
            <div className='flex items-center justify-center gap-5 mb-6'>
              <img
                src={logo_durango}
                alt='Universidad Espana Durango'
                className='h-16 w-auto object-contain'
              />

              <div className='h-10 w-px bg-slate-200'></div>

              <div className='inline-flex items-center justify-center w-16 h-16 rounded-xl shadow-sm'>
                <img
                  src={logo}
                  alt='Aquila orientadora'
                  className='w-full h-full rounded-xl object-cover shrink-0'
                />
              </div>
            </div>

            <h2 className='text-2xl font-bold text-slate-900'>
              Bienvenida de nuevo
            </h2>
            <p className='text-slate-500'>Ingresa a tu cuenta para continuar</p>
          </div>

          <div className='hidden lg:block mb-8'>
            <h2 className='text-3xl font-bold text-slate-900'>
              Iniciar sesion
            </h2>
            <p className='text-slate-500 mt-2'>Accede a UNES Orienta IA</p>
          </div>

          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className='mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-start gap-3'
            >
              <div className='text-red-500 mt-0.5'>
                <CheckCircle2 size={18} className='rotate-45' />
              </div>
              <p className='text-sm text-red-700 font-medium'>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-slate-700 ml-1'>
                Correo electronico
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                </div>
                <input
                  type='email'
                  name='email'
                  required
                  placeholder='tu@correo.com'
                  autoComplete='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='ml-1'>
                <label className='text-sm font-semibold text-slate-700'>
                  Contraseña
                </label>
              </div>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  required
                  placeholder='••••••••'
                  autoComplete='current-password'
                  value={formData.password}
                  onChange={handleChange}
                  className='block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full group relative flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 font-bold text-lg shadow-lg shadow-violet-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden'
            >
              <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer' />

              {isSubmitting ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span>Cargando...</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <span>Iniciar sesion</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </div>
              )}
            </button>
          </form>

          <div className='mt-8 pt-6 border-t border-slate-100 text-center space-y-4'>
            <p className='text-sm text-slate-600'>
              No tienes una cuenta activa?{' '}
              <button
                onClick={() => onChange('register')}
                className='font-bold text-violet-600 hover:text-violet-800 transition-colors'
              >
                Registrate aqui
              </button>
            </p>
          </div>
        </div>

        <a
          href='mailto:admisiones@unes.example'
          className='block bg-blue-50/70 border-t border-blue-100 p-3 text-center group hover:bg-blue-50 transition-colors'
        >
          <span className='text-xs font-bold text-blue-700/80 group-hover:text-blue-800 flex items-center justify-center gap-2 transition-colors uppercase sm:tracking-widest'>
            <MessageCircle className='w-4 h-4 shrink-0' />
            Solicitar informacion de admisiones
          </span>
        </a>
      </div>
    </motion.div>
  )
}

