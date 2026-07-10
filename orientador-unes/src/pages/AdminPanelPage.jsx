import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Lock, Loader2, Save, KeyRound, Cpu, Sparkles, Eye, EyeOff,
  Server, Zap, LogOut, ChevronLeft, AlertCircle, CheckCircle2,
  BookOpen, ChevronRight, Users, BarChart3
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api, adminStore } from '../lib/api'
import AquilaAvatar from '../components/AquilaAvatar'

/**
 * Panel admin del bot Aquila.
 *
 * Estados:
 *   - locked   → pantalla de PIN
 *   - unlocked → editor de config (API key, modelo, prompt…)
 *
 * La API key nunca se muestra en claro: el backend devuelve `api_key_masked`.
 * Al enviar la key nueva, viaja por HTTPS y se guarda cifrada en el backend.
 */
const AdminPanelPage = () => {
  const nav = useNavigate()
  const [locked, setLocked] = useState(!adminStore.isActive())
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [cfg, setCfg] = useState(null)
  const [defaultPrompt, setDefaultPrompt] = useState('')
  const [dirty, setDirty] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    document.title = 'Panel Admin · Aquila'
    if (!locked) loadConfig()
  }, [locked])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const r = await api.admin.getConfig()
      setCfg(r.config)
      setDefaultPrompt(r.default_prompt)
    } catch (e) {
      if (e.status === 401) {
        adminStore.clear()
        setLocked(true)
      } else {
        toast.error(e.message || 'No se pudo cargar la configuración.')
      }
    } finally {
      setLoading(false)
    }
  }

  const doLogin = async (e) => {
    e.preventDefault()
    if (!pin) return
    setLoading(true)
    try {
      const r = await api.admin.login(pin)
      adminStore.save(r.admin_session)
      setLocked(false)
      setPin('')
      toast.success('Acceso autorizado')
    } catch (e) {
      toast.error(e.message || 'PIN incorrecto.')
    } finally {
      setLoading(false)
    }
  }

  const doLogout = async () => {
    try { await api.admin.logout() } catch {}
    adminStore.clear()
    setLocked(true)
    setCfg(null)
    toast('Sesión de admin cerrada.')
  }

  const onChange = (k, v) => {
    setCfg((c) => ({ ...c, [k]: v }))
    setDirty(true)
  }

  const save = async () => {
    if (!cfg) return
    setLoading(true)
    try {
      const payload = {
        provider: cfg.provider,
        model: cfg.model,
        api_base: cfg.api_base,
        system_prompt: cfg.system_prompt,
        temperature: Number(cfg.temperature),
        max_tokens: Number(cfg.max_tokens),
        enabled: !!cfg.enabled
      }
      if (newKey?.trim()) payload.api_key = newKey.trim()
      const r = await api.admin.updateConfig(payload)
      setCfg(r.config)
      setDirty(false)
      setNewKey('')
      toast.success('Configuración guardada')
    } catch (e) {
      toast.error(e.message || 'No se pudo guardar.')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const r = await api.admin.testConnection()
      toast.success(`Conexión OK · ${r.model_used || ''}`)
    } catch (e) {
      toast.error(e.message || 'No se pudo probar la conexión.')
    } finally {
      setTesting(false)
    }
  }

  // ---------------- LOCKED SCREEN ----------------
  if (locked) {
    return (
      <div className='min-h-full flex items-center justify-center px-5 pt-10 pb-24 relative overflow-hidden'>
        <div
          aria-hidden
          className='absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-50 blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)'
          }}
        />
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={doLogin}
          className='relative w-full max-w-sm rounded-3xl p-6 flex flex-col items-center'
          style={{
            background:
              'linear-gradient(160deg, rgba(15,23,42,0.85), rgba(29,78,216,0.35))',
            border: '1px solid rgba(147,197,253,0.3)',
            boxShadow: '0 24px 48px rgba(2,13,51,0.6)'
          }}
        >
          <Link
            to='/'
            className='absolute top-3 left-3 text-blue-200/70 hover:text-white transition-colors text-xs flex items-center gap-1'
          >
            <ChevronLeft className='w-4 h-4' /> Volver
          </Link>

          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center mb-4'
            style={{
              background: 'linear-gradient(145deg, #1d4ed8, #1e3a8a)',
              boxShadow: '0 12px 24px rgba(29,78,216,0.5)'
            }}
          >
            <Shield className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-white text-2xl font-extrabold'>Panel Admin</h1>
          <p className='text-blue-200/70 text-center text-sm mt-1'>
            Acceso restringido. Introduce el PIN de administrador.
          </p>

          <label className='w-full mt-6'>
            <span className='block text-blue-100/85 text-[11.5px] font-semibold uppercase tracking-wider mb-1'>
              PIN de administrador
            </span>
            <span
              className='flex items-center gap-2 rounded-xl px-3 py-3 transition-all'
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(147,197,253,0.25)'
              }}
            >
              <Lock className='w-4 h-4 text-blue-200/70' />
              <input
                type='password'
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder='••••••••'
                autoFocus
                className='bg-transparent w-full text-white placeholder:text-blue-200/40 text-sm outline-none tracking-widest'
              />
            </span>
          </label>

          <button
            type='submit'
            disabled={loading || !pin}
            className='mt-5 w-full rounded-2xl py-3 font-extrabold text-white text-[14px] flex items-center justify-center gap-2 disabled:opacity-60 transition-all active:scale-[0.98]'
            style={{
              background:
                'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 60%, #1e40af 100%)',
              boxShadow: '0 10px 22px rgba(37,99,235,0.5)'
            }}
          >
            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <KeyRound className='w-4 h-4' />}
            Entrar
          </button>

          <p className='text-blue-200/60 text-[11px] text-center mt-4 leading-relaxed'>
            La sesión de admin expira en 1 hora por seguridad.
          </p>
        </motion.form>
      </div>
    )
  }

  // ---------------- UNLOCKED ----------------
  return (
    <div className='relative min-h-full px-4 pt-6 pb-24 max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-4'>
        <Link
          to='/'
          className='w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all'
        >
          <ChevronLeft className='w-5 h-5' />
        </Link>
        <div className='flex-1'>
          <h1 className='text-white text-xl font-extrabold flex items-center gap-2'>
            <Shield className='w-5 h-5 text-sky-300' /> Panel Admin
          </h1>
          <p className='text-blue-200/70 text-xs'>Configuración del bot Aquila</p>
        </div>
        <button
          onClick={doLogout}
          className='px-3 py-2 rounded-xl text-xs font-semibold text-white/90 border border-white/15 hover:bg-white/10 transition-all flex items-center gap-1.5'
        >
          <LogOut className='w-3.5 h-3.5' /> Salir
        </button>
      </div>

      {loading && !cfg && (
        <div className='flex items-center justify-center py-12 text-blue-200/70'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      )}

      {cfg && (
        <div className='space-y-4'>
          {/* Accesos rápidos: Knowledge + Usuarios + Dashboard */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            <Link to='/admin/knowledge' className='block'>
              <div
                className='rounded-2xl p-4 flex items-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99] h-full'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(139,92,246,0.28), rgba(59,130,246,0.18))',
                  border: '1px solid rgba(147,197,253,0.35)',
                  boxShadow: '0 8px 20px rgba(88,28,135,0.35)'
                }}
              >
                <div
                  className='w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0'
                  style={{
                    background: 'linear-gradient(145deg, #8b5cf6, #6d28d9)',
                    boxShadow: '0 6px 14px rgba(139,92,246,0.45)'
                  }}
                >
                  <BookOpen className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1'>
                  <div className='text-white font-extrabold text-[14px]'>
                    Base de conocimiento
                  </div>
                  <div className='text-blue-100/80 text-[11.5px]'>
                    Documentos MD que Aquila consulta (RAG)
                  </div>
                </div>
                <ChevronRight className='w-5 h-5 text-white/70' />
              </div>
            </Link>

            <Link to='/admin/users' className='block'>
              <div
                className='rounded-2xl p-4 flex items-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99] h-full'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(34,197,94,0.28), rgba(56,189,248,0.18))',
                  border: '1px solid rgba(147,197,253,0.35)',
                  boxShadow: '0 8px 20px rgba(21,128,61,0.35)'
                }}
              >
                <div
                  className='w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0'
                  style={{
                    background: 'linear-gradient(145deg, #22c55e, #15803d)',
                    boxShadow: '0 6px 14px rgba(34,197,94,0.45)'
                  }}
                >
                  <Users className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1'>
                  <div className='text-white font-extrabold text-[14px]'>
                    Usuarios registrados
                  </div>
                  <div className='text-blue-100/80 text-[11.5px]'>
                    Filtros por ciclo y fecha · CSV
                  </div>
                </div>
                <ChevronRight className='w-5 h-5 text-white/70' />
              </div>
            </Link>

            <Link to='/admin/dashboard' className='block'>
              <div
                className='rounded-2xl p-4 flex items-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99] h-full'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245,158,11,0.28), rgba(239,68,68,0.18))',
                  border: '1px solid rgba(251,191,36,0.35)',
                  boxShadow: '0 8px 20px rgba(194,65,12,0.35)'
                }}
              >
                <div
                  className='w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0'
                  style={{
                    background: 'linear-gradient(145deg, #f59e0b, #b45309)',
                    boxShadow: '0 6px 14px rgba(245,158,11,0.45)'
                  }}
                >
                  <BarChart3 className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1'>
                  <div className='text-white font-extrabold text-[14px]'>
                    Dashboard
                  </div>
                  <div className='text-blue-100/80 text-[11.5px]'>
                    Actividad · Gráficos · Métricas por ciclo
                  </div>
                </div>
                <ChevronRight className='w-5 h-5 text-white/70' />
              </div>
            </Link>
          </div>

          {/* Estado */}
          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-white font-bold flex items-center gap-2'>
                  <Sparkles className='w-4 h-4 text-sky-300' /> Bot activo
                </div>
                <div className='text-blue-200/70 text-xs mt-0.5'>
                  Activa o desactiva las respuestas de Aquila.
                </div>
              </div>
              <Toggle
                value={cfg.enabled}
                onChange={(v) => onChange('enabled', v)}
              />
            </div>
          </Card>

          {/* Proveedor + modelo + endpoint */}
          <Card>
            <SectionTitle icon={Server}>Proveedor de IA</SectionTitle>
            <div className='grid grid-cols-2 gap-3 mt-2'>
              <TextField
                label='Proveedor'
                value={cfg.provider}
                onChange={(v) => onChange('provider', v)}
                placeholder='openai'
              />
              <TextField
                label='Modelo'
                value={cfg.model}
                onChange={(v) => onChange('model', v)}
                placeholder='gpt-4o-mini'
              />
            </div>
            <TextField
              label='API base URL'
              value={cfg.api_base}
              onChange={(v) => onChange('api_base', v)}
              placeholder='https://api.openai.com/v1'
            />
          </Card>

          {/* API key */}
          <Card>
            <SectionTitle icon={KeyRound}>API key</SectionTitle>
            <div className='mt-2 flex items-center gap-2 text-sm'>
              {cfg.has_api_key ? (
                <span className='inline-flex items-center gap-1.5 text-emerald-300'>
                  <CheckCircle2 className='w-4 h-4' /> Configurada
                </span>
              ) : (
                <span className='inline-flex items-center gap-1.5 text-amber-300'>
                  <AlertCircle className='w-4 h-4' /> Sin configurar
                </span>
              )}
              <span className='text-blue-200/70 font-mono text-xs ml-auto'>
                {cfg.api_key_masked || '—'}
              </span>
            </div>
            <label className='block mt-3'>
              <span className='block text-blue-100/85 text-[11.5px] font-semibold uppercase tracking-wider mb-1'>
                Reemplazar API key
              </span>
              <span
                className='flex items-center gap-2 rounded-xl px-3 py-2.5'
                style={{
                  background: 'rgba(15,23,42,0.7)',
                  border: '1px solid rgba(147,197,253,0.25)'
                }}
              >
                <KeyRound className='w-4 h-4 text-blue-200/70' />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={newKey}
                  onChange={(e) => { setNewKey(e.target.value); setDirty(true) }}
                  placeholder='sk-…'
                  autoComplete='new-password'
                  className='bg-transparent flex-1 text-white placeholder:text-blue-200/40 text-sm outline-none font-mono'
                />
                <button
                  type='button'
                  onClick={() => setShowKey(!showKey)}
                  className='text-blue-200/60 hover:text-white'
                >
                  {showKey ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </span>
              <span className='block text-blue-200/60 text-[11px] mt-1'>
                La key viaja cifrada al backend y se guarda con AES-256. Nunca se
                envía al navegador de vuelta.
              </span>
            </label>
          </Card>

          {/* Prompt */}
          <Card>
            <div className='flex items-center justify-between'>
              <SectionTitle icon={Cpu}>Prompt de comportamiento</SectionTitle>
              <button
                type='button'
                onClick={() => { onChange('system_prompt', defaultPrompt); setDirty(true) }}
                className='text-xs text-sky-300 hover:text-white'
              >
                Restaurar por defecto
              </button>
            </div>
            <textarea
              value={cfg.system_prompt || ''}
              onChange={(e) => onChange('system_prompt', e.target.value)}
              rows={10}
              className='mt-2 w-full rounded-xl bg-slate-900/70 border border-white/10 text-blue-100 text-[13px] p-3 font-mono outline-none focus:border-sky-400/60 transition-colors resize-y'
              placeholder='Escribe la persona y reglas de Aquila…'
            />
          </Card>

          {/* Parámetros de generación */}
          <Card>
            <SectionTitle icon={Zap}>Parámetros de generación</SectionTitle>
            <div className='grid grid-cols-2 gap-3 mt-2'>
              <TextField
                label={`Temperatura: ${(cfg.temperature / 100).toFixed(2)}`}
                type='range'
                min={0}
                max={100}
                value={cfg.temperature}
                onChange={(v) => onChange('temperature', v)}
              />
              <TextField
                label='Max tokens'
                type='number'
                min={64}
                max={4000}
                value={cfg.max_tokens}
                onChange={(v) => onChange('max_tokens', v)}
              />
            </div>
          </Card>

          {/* Acciones */}
          <div className='sticky bottom-4 flex gap-2 pt-2'>
            <button
              type='button'
              onClick={testConnection}
              disabled={testing || !cfg.has_api_key}
              className='flex-1 rounded-2xl py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/10 disabled:opacity-60 transition-all flex items-center justify-center gap-2'
              style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
            >
              {testing ? <Loader2 className='w-4 h-4 animate-spin' /> : <Zap className='w-4 h-4' />}
              Probar conexión
            </button>
            <button
              type='button'
              onClick={save}
              disabled={loading || !dirty}
              className='flex-1 rounded-2xl py-3 text-sm font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all active:scale-[0.98]'
              style={{
                background:
                  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 60%, #1e40af 100%)',
                boxShadow: '0 10px 22px rgba(37,99,235,0.5)'
              }}
            >
              {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
              Guardar
            </button>
          </div>

          {/* Preview de Aquila */}
          <div className='flex items-center justify-center gap-3 pt-4 opacity-70'>
            <AquilaAvatar className='w-10 h-10 rounded-full overflow-hidden' />
            <span className='text-blue-200/70 text-xs'>
              Los cambios aplican en el próximo mensaje del chat.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const Card = ({ children }) => (
  <div
    className='rounded-2xl p-4'
    style={{
      background: 'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
      border: '1px solid rgba(147,197,253,0.2)',
      boxShadow: '0 8px 20px rgba(2,13,51,0.35)'
    }}
  >
    {children}
  </div>
)

const SectionTitle = ({ icon: Icon, children }) => (
  <div className='flex items-center gap-2 text-white font-bold text-[14px]'>
    <Icon className='w-4 h-4 text-sky-300' />
    {children}
  </div>
)

const TextField = ({ label, value, onChange, ...props }) => (
  <label className='block'>
    <span className='block text-blue-100/85 text-[11.5px] font-semibold uppercase tracking-wider mb-1'>
      {label}
    </span>
    <input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      className='w-full rounded-xl bg-slate-900/70 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-sky-400/60 transition-colors'
    />
  </label>
)

const Toggle = ({ value, onChange }) => (
  <button
    type='button'
    onClick={() => onChange(!value)}
    className='relative w-11 h-6 rounded-full transition-colors'
    style={{
      background: value
        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
        : 'rgba(148,163,184,0.35)'
    }}
    aria-pressed={value}
  >
    <span
      className='absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow'
      style={{ left: value ? '22px' : '2px' }}
    />
  </button>
)

export default AdminPanelPage
