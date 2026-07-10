import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ChevronLeft, BarChart3, Users, MessageCircle, Sparkles, Calendar,
  GraduationCap, Filter, X, RefreshCw, Loader2, TrendingUp, Zap,
  Clock, Trophy, Coins
} from 'lucide-react'
import { api, adminStore } from '../lib/api'

/**
 * Dashboard analítico del panel orientador de UNES.
 *
 * - Filtros por rango de fechas (desde / hasta) y por ciclo escolar.
 * - Métricas resumen (usuarios y mensajes) + tarjetas globales all-time.
 * - Gráficos: usuarios por día, mensajes por día, distribución por ciclo,
 *   top 10 usuarios más activos.
 * - Todo se pinta con SVG puro para evitar dependencias extra.
 */
const AdminDashboardPage = () => {
  const nav = useNavigate()

  const today = new Date().toISOString().slice(0, 10)
  const defaultDesde = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10)

  const [desde, setDesde] = useState(defaultDesde)
  const [hasta, setHasta] = useState(today)
  const [ciclo, setCiclo] = useState('')
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminStore.isActive()) {
      nav('/admin', { replace: true })
      return
    }
    document.title = 'Dashboard · Aquila Admin'
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [desde, hasta, ciclo])

  const load = async () => {
    setLoading(true)
    try {
      const r = await api.admin.stats({ desde, hasta, ciclo })
      setData(r)
    } catch (e) {
      if (e.status === 401) {
        adminStore.clear()
        nav('/admin', { replace: true })
      } else {
        toast.error(e.message || 'No se pudieron cargar las métricas.')
      }
    } finally {
      setLoading(false)
    }
  }

  const applyPreset = (days) => {
    const end = new Date().toISOString().slice(0, 10)
    const start = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10)
    setDesde(start); setHasta(end)
  }

  const resetCiclo = () => setCiclo('')

  const ciclosDisponibles = data?.ciclos_disponibles || []
  const resumen  = data?.resumen  || {}
  const globales = data?.globales || {}

  return (
    <div className='relative min-h-full px-4 pt-6 pb-24 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-4'>
        <Link
          to='/admin'
          className='w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all'
        >
          <ChevronLeft className='w-5 h-5' />
        </Link>
        <div className='flex-1'>
          <h1 className='text-white text-xl font-extrabold flex items-center gap-2'>
            <BarChart3 className='w-5 h-5 text-sky-300' /> Dashboard
          </h1>
          <p className='text-blue-200/70 text-xs'>
            Actividad y métricas de UNES Orienta IA
          </p>
        </div>
        <button
          onClick={load}
          className='w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all'
          title='Refrescar'
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filtros */}
      <div
        className='rounded-xl p-3 mb-4 flex flex-wrap items-end gap-3'
        style={{
          background: 'rgba(15,23,42,0.55)',
          border: '1px solid rgba(147,197,253,0.18)'
        }}
      >
        <div className='flex items-center gap-1.5 text-blue-200/85 text-[11px] uppercase tracking-wider font-semibold shrink-0'>
          <Filter className='w-3.5 h-3.5 text-sky-300' /> Filtros
        </div>

        <label className='flex flex-col gap-1 text-[11px] text-blue-200/75'>
          <span className='flex items-center gap-1'>
            <Calendar className='w-3 h-3' /> Desde
          </span>
          <input
            type='date'
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className='rounded-md bg-slate-900/70 border border-white/10 text-white text-xs px-2 py-1.5 outline-none'
            style={{ colorScheme: 'dark' }}
          />
        </label>

        <label className='flex flex-col gap-1 text-[11px] text-blue-200/75'>
          <span className='flex items-center gap-1'>
            <Calendar className='w-3 h-3' /> Hasta
          </span>
          <input
            type='date'
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className='rounded-md bg-slate-900/70 border border-white/10 text-white text-xs px-2 py-1.5 outline-none'
            style={{ colorScheme: 'dark' }}
          />
        </label>

        <label className='flex flex-col gap-1 text-[11px] text-blue-200/75'>
          <span className='flex items-center gap-1'>
            <GraduationCap className='w-3 h-3' /> Ciclo
          </span>
          <select
            value={ciclo}
            onChange={(e) => setCiclo(e.target.value)}
            className='rounded-md bg-slate-900/70 border border-white/10 text-white text-xs px-2 py-1.5 outline-none min-w-[130px]'
          >
            <option value=''>Todos</option>
            {ciclosDisponibles.map((c) => (
              <option key={c.ciclo} value={c.ciclo}>
                {c.ciclo} ({c.total})
              </option>
            ))}
          </select>
        </label>

        <div className='flex items-center gap-1.5 ml-auto'>
          {[
            { l: '7d', d: 7 }, { l: '30d', d: 30 }, { l: '90d', d: 90 }
          ].map((p) => (
            <button
              key={p.l}
              onClick={() => applyPreset(p.d)}
              className='text-[11px] text-blue-200/85 hover:text-white px-2 py-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-colors'
            >
              {p.l}
            </button>
          ))}
          {ciclo && (
            <button
              onClick={resetCiclo}
              className='text-[11px] text-blue-200/85 hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-colors'
            >
              <X className='w-3 h-3' /> ciclo
            </button>
          )}
        </div>
      </div>

      {loading && !data ? (
        <div className='py-16 text-center text-blue-200/70'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto' />
          <div className='text-sm mt-2'>Cargando métricas…</div>
        </div>
      ) : (
        <>
          {/* Métricas resumen del rango */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mb-4'>
            <MetricCard icon={Users} label='Usuarios en rango' value={resumen.usuarios_en_rango} color='#3b82f6' />
            <MetricCard icon={MessageCircle} label='Mensajes en rango' value={resumen.mensajes_en_rango} color='#06b6d4' />
            <MetricCard icon={Zap} label='Prom. msjs/usuario' value={resumen.promedio_msgs_user} color='#f59e0b' isFloat />
            <MetricCard icon={Coins} label='Tokens usados' value={resumen.tokens_totales} color='#a855f7' />
          </div>

          {/* Globales all-time */}
          <div
            className='rounded-xl p-3 mb-4'
            style={{
              background: 'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
              border: '1px solid rgba(147,197,253,0.2)'
            }}
          >
            <div className='text-blue-100/85 text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2'>
              <TrendingUp className='w-3.5 h-3.5 text-emerald-300' /> Global (histórico)
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              <MiniStat label='Total usuarios' value={globales.usuarios_totales_all_time} />
              <MiniStat label='Nuevos hoy' value={globales.usuarios_hoy} />
              <MiniStat label='Nuevos 30d' value={globales.usuarios_ultimos_30d} />
              <MiniStat label='Ciclo actual' value={globales.ciclo_actual} />
            </div>
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4'>
            <ChartCard title='Usuarios nuevos por día' icon={Users} color='#3b82f6'>
              <LineChart
                data={data?.usuarios_por_dia || []}
                color='#3b82f6'
                emptyLabel='Sin registros en el rango'
              />
            </ChartCard>

            <ChartCard title='Mensajes por día' icon={MessageCircle} color='#06b6d4'>
              <LineChart
                data={data?.mensajes_por_dia || []}
                color='#06b6d4'
                emptyLabel='Sin actividad en el rango'
              />
            </ChartCard>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
            <ChartCard title='Distribución por ciclo' icon={GraduationCap} color='#a855f7'>
              <BarChart data={data?.usuarios_por_ciclo || []} color='#a855f7' />
            </ChartCard>

            <ChartCard title='Top 10 usuarios más activos' icon={Trophy} color='#f59e0b'>
              <TopUsers data={data?.top_usuarios || []} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}

/* ------------ subcomponentes ------------ */

const MetricCard = ({ icon: Icon, label, value, color, isFloat = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className='rounded-xl p-3'
    style={{
      background: 'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
      border: '1px solid rgba(147,197,253,0.2)',
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px ${color}22`
    }}
  >
    <div className='flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold' style={{ color: color + 'ee' }}>
      <Icon className='w-3 h-3' /> {label}
    </div>
    <div className='text-white font-extrabold text-2xl mt-1'>
      {value == null
        ? '—'
        : typeof value === 'number'
          ? (isFloat ? value.toLocaleString('es-MX', { maximumFractionDigits: 2 }) : value.toLocaleString('es-MX'))
          : value}
    </div>
  </motion.div>
)

const MiniStat = ({ label, value }) => (
  <div className='rounded-lg p-2' style={{ background: 'rgba(15,23,42,0.5)' }}>
    <div className='text-blue-200/65 text-[10px] uppercase tracking-wider'>{label}</div>
    <div className='text-white font-bold text-base mt-0.5'>
      {value == null ? '—' : (typeof value === 'number' ? value.toLocaleString('es-MX') : value)}
    </div>
  </div>
)

const ChartCard = ({ title, icon: Icon, color, children }) => (
  <div
    className='rounded-xl p-3'
    style={{
      background: 'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
      border: '1px solid rgba(147,197,253,0.2)'
    }}
  >
    <div className='flex items-center gap-1.5 text-blue-100/85 text-[12px] font-semibold mb-3'>
      <Icon className='w-3.5 h-3.5' style={{ color }} />
      {title}
    </div>
    {children}
  </div>
)

/** Line chart SVG minimalista. data = [{fecha, total}] */
const LineChart = ({ data, color = '#3b82f6', emptyLabel = 'Sin datos' }) => {
  if (!data || data.length === 0) {
    return <div className='h-40 flex items-center justify-center text-blue-200/50 text-xs'>{emptyLabel}</div>
  }
  const W = 500, H = 160, PX = 32, PY = 18
  const max = Math.max(1, ...data.map(d => d.total))
  const stepX = data.length > 1 ? (W - PX * 2) / (data.length - 1) : 0
  const points = data.map((d, i) => {
    const x = PX + i * stepX
    const y = H - PY - (d.total / max) * (H - PY * 2)
    return [x, y, d]
  })
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const areaPath = `${path} L ${points[points.length - 1][0]} ${H - PY} L ${points[0][0]} ${H - PY} Z`
  // Etiquetas: primera, media, última.
  const labelIdx = data.length === 1 ? [0] : [0, Math.floor(data.length / 2), data.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className='w-full h-40'>
      <defs>
        <linearGradient id={`grad-${color.slice(1)}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity='0.4' />
          <stop offset='100%' stopColor={color} stopOpacity='0' />
        </linearGradient>
      </defs>
      {/* eje Y máximo */}
      <text x={4} y={PY + 4} fontSize='9' fill='rgba(147,197,253,0.6)'>{max}</text>
      <text x={4} y={H - PY + 8} fontSize='9' fill='rgba(147,197,253,0.6)'>0</text>
      {/* grid horizontal */}
      <line x1={PX} y1={H - PY} x2={W - 4} y2={H - PY} stroke='rgba(147,197,253,0.15)' />
      {/* área + línea */}
      <path d={areaPath} fill={`url(#grad-${color.slice(1)})`} />
      <path d={path} fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      {/* puntos */}
      {points.map(([x, y, d], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r='2.5' fill={color} />
          <title>{d.fecha}: {d.total}</title>
        </g>
      ))}
      {/* etiquetas eje X */}
      {labelIdx.map((i) => {
        const [x] = points[i]
        return (
          <text key={i} x={x} y={H - 4} fontSize='9' textAnchor='middle' fill='rgba(147,197,253,0.7)'>
            {shortDate(data[i].fecha)}
          </text>
        )
      })}
    </svg>
  )
}

/** Bar chart horizontal. data = [{ciclo, total}] */
const BarChart = ({ data, color = '#a855f7' }) => {
  if (!data || data.length === 0) {
    return <div className='h-40 flex items-center justify-center text-blue-200/50 text-xs'>Sin ciclos registrados</div>
  }
  const max = Math.max(1, ...data.map(d => d.total))
  return (
    <div className='space-y-2'>
      {data.map((d) => {
        const pct = (d.total / max) * 100
        return (
          <div key={d.ciclo} className='flex items-center gap-2'>
            <div className='w-20 text-[11px] font-mono text-blue-200/85 shrink-0'>{d.ciclo}</div>
            <div className='flex-1 h-5 rounded-md overflow-hidden' style={{ background: 'rgba(15,23,42,0.5)' }}>
              <div
                className='h-full flex items-center justify-end pr-2'
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}77, ${color})`,
                  minWidth: '24px'
                }}
              >
                <span className='text-[10px] font-bold text-white'>{d.total}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const TopUsers = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className='h-40 flex items-center justify-center text-blue-200/50 text-xs'>Sin actividad en el rango</div>
  }
  const max = Math.max(1, ...data.map(d => d.mensajes))
  return (
    <div className='space-y-1.5 max-h-64 overflow-y-auto pr-1'>
      {data.map((u, i) => {
        const pct = (u.mensajes / max) * 100
        return (
          <div key={u.user_id} className='flex items-center gap-2 rounded-md px-2 py-1.5' style={{ background: 'rgba(15,23,42,0.4)' }}>
            <span className='w-5 text-center text-[11px] font-bold text-amber-300'>#{i + 1}</span>
            <div className='flex-1 min-w-0'>
              <div className='text-white text-[12px] font-semibold truncate'>{u.nombre || 'Sin nombre'}</div>
              <div className='text-blue-200/60 text-[10px] truncate flex items-center gap-1'>
                <span>{u.email || '—'}</span>
                {u.ciclo && (
                  <span className='px-1 rounded' style={{ background: 'rgba(168,85,247,0.2)', color: '#d8b4fe' }}>
                    {u.ciclo}
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2 shrink-0'>
              <div className='w-16 h-1.5 rounded-full overflow-hidden' style={{ background: 'rgba(15,23,42,0.7)' }}>
                <div
                  className='h-full'
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  }}
                />
              </div>
              <span className='text-white font-bold text-[12px] tabular-nums w-8 text-right'>{u.mensajes}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function shortDate(iso) {
  if (!iso) return ''
  const parts = iso.split('-')
  if (parts.length < 3) return iso
  return `${parts[2]}/${parts[1]}`
}

export default AdminDashboardPage
