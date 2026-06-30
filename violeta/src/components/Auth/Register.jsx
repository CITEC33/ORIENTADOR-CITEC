import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/SupabaseAuthContext'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  MapPin,
  Text
} from 'lucide-react'
import logo_durango from '../../assets/imgs/logo-unes.png'
import logo from '../../assets/imgs/violeta-orienta-avatar.png'

const Register = ({ onChange }) => {
  const navigate = useNavigate()
  const { signUp, user } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    phone: '',
    address: '',
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (!formData.fullName.trim())
      return setError('El nombre completo es obligatorio')
    if (!formData.phone.trim()) return setError('El teléfono es obligatorio')
    if (!formData.address.trim()) return setError('La dirección es obligatoria')
    if (!formData.email.trim()) return setError('El correo es obligatorio')
    if (formData.password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) return

    setLoading(true)

    const userData = {
      nombreCompleto: formData.fullName,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      telefono: formData.phone,
      direccion: formData.address
    }

    const { error } = await signUp(formData.email, formData.password, userData)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className='flex justify-center'
    >
      <div className='w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative'>
        <div className='h-2 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600' />

        <div className='p-4 sm:p-8'>
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
                  alt='Violeta orientadora'
                  className='w-full h-full rounded-xl object-cover shrink-0'
                />
              </div>
            </div>

            <h2 className='text-2xl font-bold text-slate-900'>Crear cuenta</h2>
            <p className='text-slate-500'>
              {' '}
              Crea tu acceso a UNES Orienta IA
            </p>
          </div>

          <div className='hidden lg:block text-center mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>Crear cuenta</h2>
            <p className='text-slate-500 text-sm mt-1'>
              Crea tu acceso a UNES Orienta IA
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 p-3 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-start gap-3'
            >
              <AlertCircle className='text-red-500 w-5 h-5 flex-shrink-0' />
              <p className='text-sm text-red-700 font-medium'>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-1'>
              <div className='relative group'>
                <User className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type='text'
                  name='fullName'
                  placeholder='Nombre completo'
                  autoComplete='name'
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <div className='relative group'>
                <Text className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type='text'
                  name='apellidoPaterno'
                  placeholder='Apellido paterno'
                  autoComplete='family-name'
                  required
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <div className='relative group'>
                <Text className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type='text'
                  name='apellidoMaterno'
                  placeholder='Apellido materno'
                  autoComplete='family-name'
                  required
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <div className='relative group'>
                <MessageCircle className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type='tel'
                  name='phone'
                  placeholder='Teléfono celular'
                  autoComplete='tel'
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <div className='relative group'>
                <MapPin className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type='text'
                  name='address'
                  placeholder='Dirección completa'
                  autoComplete='street-address'
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <div className='relative group'>
                <Mail className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type='email'
                  name='email'
                  placeholder='Correo electronico'
                  autoComplete='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <div className='relative group'>
                <Lock className='absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Contraseña'
                  autoComplete='new-password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium sm:text-sm text-black'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-slate-400 hover:text-slate-600'
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
              disabled={loading || success}
              className='w-full mt-2 group relative flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 font-bold text-lg shadow-lg shadow-violet-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden'
            >
              <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer' />
              {loading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span>Registrando...</span>
                </div>
              ) : success ? (
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='w-5 h-5' />
                  <span>¡Bienvenida!</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <span>Crear mi cuenta</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </div>
              )}
            </button>
          </form>

          <div className='mt-4 sm:mt-6 pt-5 border-t border-slate-100 text-center space-y-3'>
            <p className='text-sm text-slate-600'>
              Ya tienes cuenta?{' '}
              <button
                onClick={() => onChange('login')}
                className='font-bold text-violet-600 hover:text-violet-800 transition-colors'
              >
                Inicia sesion
              </button>
            </p>
          </div>
        </div>

        <a
          href='mailto:admisiones@unes.example'
          className='mt-4 sm:mt-0 block bg-blue-50/70 border-t border-blue-100 p-3 text-center group hover:bg-blue-50 transition-colors'
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

export default Register

