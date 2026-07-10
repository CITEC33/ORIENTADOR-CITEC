import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  User,
  Users,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import AquilaAvatar from '../../components/AquilaAvatar'
import logoUnesV2 from '../../assets/imgs/logo-unes-v2.png'

/**
 * Pantalla de entrada rediseñada como un onboarding de personalización.
 *
 * - Modo por defecto: `register` (llamada "personalizar"). No hay tabs.
 * - Modo secundario: `login`, accesible por un link discreto al pie
 *   ("¿Estás de vuelta? Accede con tu correo →"). Muestra solo el input
 *   de correo.
 * - Sin contraseñas. El disclaimer incluye link a la política de
 *   seguridad de UNES.
 */
const AquilaAuthPage = () => {
  const nav = useNavigate()
  const { user, ready, login, register, loading } = useAuth()

  // Modo por defecto: "register" (personalizar). El usuario existente
  // puede cambiar a "login" con el link discreto al pie.
  const [mode, setMode] = useState('register')
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.title =
      mode === 'login'
        ? 'Regresa · UNES Orienta IA · Aquila'
        : 'Personaliza tu experiencia · UNES Orienta IA · Aquila'
  }, [mode])

  useEffect(() => {
    if (ready && user) nav('/', { replace: true })
  }, [ready, user, nav])

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: null }))
  }

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
  }

  const submit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      if (mode === 'login') {
        if (!form.email) {
          setErrors({ email: 'Escribe tu correo.' })
          return
        }
        await login(form.email.trim().toLowerCase())
        toast.success('¡Qué gusto verte de nuevo! 🦅')
        nav('/', { replace: true })
      } else {
        const req = ['nombre', 'apellidos', 'email', 'telefono']
        const missing = {}
        req.forEach((k) => {
          if (!form[k]?.trim()) missing[k] = 'Campo obligatorio'
        })
        if (Object.keys(missing).length) return setErrors(missing)
        await register({
          nombre: form.nombre.trim(),
          apellidos: form.apellidos.trim(),
          email: form.email.trim().toLowerCase(),
          telefono: form.telefono.trim()
        })
        toast.success('¡Listo! Aquila ya te tiene ubicado 🦅')
        nav('/', { replace: true })
      }
    } catch (err) {
      if (err.status === 422 && err.data?.errors) {
        const flat = {}
        Object.entries(err.data.errors).forEach(([k, v]) => {
          flat[k] = Array.isArray(v) ? v[0] : v
        })
        setErrors(flat)
      } else if (err.status === 404) {
        toast.error(
          'No encontramos una cuenta con ese correo. Personaliza tu experiencia primero.'
        )
        setMode('register')
      } else if (err.status === 409) {
        toast.error(
          'Ese correo ya está registrado. Accede desde “¿Estás de vuelta?”.'
        )
        setMode('login')
      } else {
        toast.error(err.message || 'No se pudo procesar la solicitud.')
      }
    }
  }

  const isLogin = mode === 'login'

  return (
    <div
      className='min-h-screen unes-bg flex flex-col items-center justify-start px-5 relative overflow-hidden'
      style={{
        paddingTop: 'calc(2rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))'
      }}
    >
      {/* Glow decorativos */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        <div
          className='absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-60 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)'
          }}
        />
        <div
          className='absolute bottom-0 -left-24 w-80 h-80 rounded-full opacity-40 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Logo + avatar */}
      <div className='relative w-full max-w-sm flex flex-col items-center'>
        <div
          className='rounded-2xl px-3 py-1.5 mb-4 backdrop-blur-md'
          style={{
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(219,234,254,0.9))',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 8px 22px rgba(2,13,51,0.5)'
          }}
        >
          <img
            src={logoUnesV2}
            alt='Universidad España'
            className='h-9 w-auto select-none pointer-events-none'
            draggable={false}
          />
        </div>
        <AquilaAvatar
          size='xl'
          className='w-36 h-36 mb-4 shadow-2xl shadow-blue-900/60 border-4 border-white/20 rounded-full overflow-hidden'
        />

        <AnimatePresence mode='wait'>
          {isLogin ? (
            <motion.div
              key='hdr-login'
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className='flex flex-col items-center'
            >
              <h1
                className='text-3xl sm:text-[34px] font-extrabold tracking-tight text-center text-white'
                style={{ textShadow: '0 2px 8px rgba(2,13,51,0.55)' }}
              >
                ¿Estás de regreso?
              </h1>
              <p
                className='text-white/95 text-center mt-2 text-sm max-w-xs'
                style={{ textShadow: '0 1px 4px rgba(2,13,51,0.5)' }}
              >
                Accede con tu correo y sigue donde lo dejaste con Aquila.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key='hdr-reg'
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className='flex flex-col items-center'
            >
              <div className='flex items-center gap-2 mb-2'>
                <Sparkles className='w-4 h-4 text-white' />
                <span
                  className='text-white text-[11px] font-extrabold uppercase tracking-[0.18em]'
                  style={{ textShadow: '0 1px 4px rgba(2,13,51,0.55)' }}
                >
                  Bienvenido a UNES Orienta IA
                </span>
              </div>
              <h1
                className='text-3xl sm:text-[34px] font-extrabold tracking-tight text-center leading-tight text-white'
                style={{ textShadow: '0 2px 8px rgba(2,13,51,0.55)' }}
              >
                Personaliza tu experiencia
              </h1>
              <p
                className='text-white/95 text-center mt-2 text-sm max-w-xs'
                style={{ textShadow: '0 1px 4px rgba(2,13,51,0.5)' }}
              >
                Para que Aquila te oriente mejor, cuéntanos quién eres.
                Sin contraseñas.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario */}
        <form onSubmit={submit} className='w-full mt-6 space-y-3 relative'>
          <AnimatePresence mode='wait'>
            {!isLogin && (
              <motion.div
                key='reg-fields'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className='space-y-3 overflow-hidden'
              >
                <Field
                  icon={User}
                  name='nombre'
                  label='Nombre'
                  value={form.nombre}
                  onChange={onChange}
                  error={errors.nombre}
                  placeholder='Ej. Ana'
                  autoComplete='given-name'
                />
                <Field
                  icon={Users}
                  name='apellidos'
                  label='Apellidos'
                  value={form.apellidos}
                  onChange={onChange}
                  error={errors.apellidos}
                  placeholder='Ej. García Pérez'
                  autoComplete='family-name'
                />
                <Field
                  icon={Phone}
                  name='telefono'
                  label='Teléfono'
                  value={form.telefono}
                  onChange={onChange}
                  error={errors.telefono}
                  placeholder='(618) 123 4567'
                  autoComplete='tel'
                  type='tel'
                  inputMode='tel'
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            icon={Mail}
            name='email'
            label='Correo electrónico'
            value={form.email}
            onChange={onChange}
            error={errors.email}
            placeholder='tu@correo.com'
            autoComplete='email'
            type='email'
            inputMode='email'
          />

          <button
            type='submit'
            disabled={loading}
            className='mt-2 w-full rounded-2xl py-3.5 font-extrabold text-white text-[15px] tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60'
            style={{
              background:
                'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
              boxShadow:
                '0 14px 30px rgba(37,99,235,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <ArrowRight className='w-4 h-4' />
            )}
            {isLogin ? 'Continuar' : 'Comenzar con Aquila'}
          </button>
        </form>

        {/* Switch modo (discreto al pie) */}
        <div className='w-full mt-5 flex items-center justify-center'>
          {isLogin ? (
            <button
              type='button'
              onClick={() => switchMode('register')}
              className='text-white/90 hover:text-white text-[13px] font-medium transition-colors inline-flex items-center gap-1.5'
              style={{ textShadow: '0 1px 3px rgba(2,13,51,0.45)' }}
            >
              ¿Primera vez? <span className='font-bold underline underline-offset-2'>Personaliza tu experiencia</span>
            </button>
          ) : (
            <button
              type='button'
              onClick={() => switchMode('login')}
              className='text-white/90 hover:text-white text-[13px] font-medium transition-colors inline-flex items-center gap-1.5'
              style={{ textShadow: '0 1px 3px rgba(2,13,51,0.45)' }}
            >
              ¿Estás de vuelta?{' '}
              <span className='font-bold underline underline-offset-2'>
                Accede con tu correo
              </span>
              <ArrowRight className='w-3.5 h-3.5' />
            </button>
          )}
        </div>

        {/* Disclaimer con link a política de UNES */}
        <div
          className='w-full mt-6 rounded-2xl p-3.5 flex items-start gap-2.5'
          style={{
            background: 'rgba(15,23,42,0.55)',
            border: '1px solid rgba(147,197,253,0.2)',
            backdropFilter: 'blur(6px)'
          }}
        >
          <ShieldCheck className='w-4 h-4 text-white/90 shrink-0 mt-0.5' />
          <p className='text-white/90 text-[11.5px] leading-relaxed'>
            Al continuar aceptas que tus datos se usen solo para personalizar tu
            orientación vocacional con Aquila. Consulta la{' '}
            <a
              href='https://unes.edu.mx/aviso-de-privacidad'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:text-cyan-100 font-bold underline underline-offset-2'
            >
              política de seguridad y privacidad de UNES
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

const Field = ({ icon: Icon, label, error, ...props }) => (
  <label className='block'>
    <span
      className='block text-white text-[11.5px] font-bold uppercase tracking-wider mb-1.5'
      style={{ textShadow: '0 1px 3px rgba(2,13,51,0.5)' }}
    >
      {label}
    </span>
    <span
      className='flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all'
      style={{
        background: 'rgba(15,23,42,0.6)',
        border: `1px solid ${
          error ? 'rgba(248,113,113,0.55)' : 'rgba(147,197,253,0.35)'
        }`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
    >
      <Icon className='w-4 h-4 text-white/85 shrink-0' />
      <input
        {...props}
        className='bg-transparent w-full text-white placeholder:text-white/55 text-sm outline-none'
      />
    </span>
    {error && (
      <span className='block text-red-300 text-[11.5px] mt-1'>{error}</span>
    )}
  </label>
)

export default AquilaAuthPage
