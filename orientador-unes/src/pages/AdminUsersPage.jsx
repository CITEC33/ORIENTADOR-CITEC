import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Users, ChevronLeft, Search, Download, Loader2, ArrowUpDown,
  X, Mail, Phone, Calendar, Clock, Trash2, MessageCircle,
  ChevronLeft as ChevLeft, ChevronRight, RefreshCw,
  Sparkles, BarChart3, Filter, GraduationCap
} from 'lucide-react'
import { api, adminStore } from '../lib/api'

/**
 * Gestión de usuarios registrados en UNES Orienta IA.
 * - Tabla con búsqueda, orden y paginación.
 * - Exportación a CSV (todos los usuarios respetando el filtro q).
 * - Drawer inferior con detalle + últimos 20 mensajes.
 */
const AdminUsersPage = () => {
  const nav = useNavigate()
  const [users, setUsers] = useState([])
  const [meta, setMeta]   = useState(null)
  const [stats, setStats] = useState(null)
  const [ciclosDisponibles, setCiclosDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ]         = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [ciclo, setCiclo] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [page, setPage]   = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [sort, setSort]   = useState('created_at')
  const [dir, setDir]     = useState('desc')

  const [selected, setSelected] = useState(null)   // usuario del drawer
  const [selectedFull, setSelectedFull] = useState(null) // con mensajes
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Redirect si no hay sesión admin
  useEffect(() => {
    if (!adminStore.isActive()) {
      nav('/admin', { replace: true })
      return
    }
    document.title = 'Usuarios · Aquila Admin'
    // eslint-disable-next-line
  }, [])

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [debouncedQ, ciclo, desde, hasta, page, perPage, sort, dir])

  const load = async () => {
    setLoading(true)
    try {
      const r = await api.admin.users.list({
        q: debouncedQ, ciclo, desde, hasta, page, perPage, sort, dir
      })
      setUsers(r.users || [])
      setMeta(r.meta || null)
      setStats(r.stats || null)
      setCiclosDisponibles(r.ciclos_disponibles || [])
    } catch (e) {
      if (e.status === 401) {
        adminStore.clear()
        nav('/admin', { replace: true })
      } else {
        toast.error(e.message || 'Error al cargar usuarios.')
      }
    } finally {
      setLoading(false)
    }
  }

  const changeSort = (col) => {
    if (sort === col) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(col)
      setDir('desc')
    }
    setPage(1)
  }

  const doExport = () => {
    const url = api.admin.users.exportCsvUrl({
      q: debouncedQ, ciclo, desde, hasta
    })
    // Abrimos en un iframe oculto para forzar descarga sin cambiar de vista
    const a = document.createElement('a')
    a.href = url
    a.rel = 'noopener'
    a.download = ''
    document.body.appendChild(a)
    a.click()
    setTimeout(() => document.body.removeChild(a), 1000)
    toast.success('Descargando CSV…')
  }

  const openDetail = async (user) => {
    setSelected(user)
    setSelectedFull(null)
    setLoadingDetail(true)
    try {
      const r = await api.admin.users.get(user.id)
      setSelectedFull(r)
    } catch (e) {
      toast.error(e.message || 'No se pudo cargar el usuario.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeDetail = () => {
    setSelected(null)
    setSelectedFull(null)
  }

  const clearFilters = () => {
    setQ(''); setCiclo(''); setDesde(''); setHasta(''); setPage(1)
  }
  const activeFilterCount =
    (debouncedQ ? 1 : 0) + (ciclo ? 1 : 0) + (desde ? 1 : 0) + (hasta ? 1 : 0)

  const removeUser = async (id) => {
    if (!confirm(`¿Eliminar al usuario #${id}? Se borran también sus mensajes.`))
      return
    try {
      await api.admin.users.remove(id)
      toast.success('Usuario eliminado')
      closeDetail()
      await load()
    } catch (e) {
      toast.error(e.message || 'No se pudo eliminar.')
    }
  }

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
            <Users className='w-5 h-5 text-sky-300' /> Usuarios registrados
          </h1>
          <p className='text-blue-200/70 text-xs'>
            Base de usuarios de UNES Orienta IA
          </p>
        </div>
        <button
          onClick={load}
          className='w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all'
          title='Refrescar'
        >
          <RefreshCw className='w-4 h-4' />
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className='grid grid-cols-2 md:grid-cols-5 gap-2 mb-4'>
          <StatCard icon={Users} label='Total' value={stats.total_users} color='#3b82f6' />
          <StatCard icon={Sparkles} label='Hoy' value={stats.new_today} color='#22c55e' />
          <StatCard icon={Calendar} label='Últ. 7 días' value={stats.new_week} color='#f59e0b' />
          <StatCard icon={Clock} label='Activos 7d' value={stats.active_week} color='#a855f7' />
          <StatCard icon={MessageCircle} label='Mensajes' value={stats.total_messages} color='#06b6d4' />
        </div>
      )}

      {/* Barra de búsqueda + export */}
      <div className='flex flex-col sm:flex-row gap-2 mb-3'>
        <div
          className='flex items-center gap-2 flex-1 rounded-xl px-3 py-2'
          style={{
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(147,197,253,0.25)'
          }}
        >
          <Search className='w-4 h-4 text-blue-200/70' />
          <input
            type='text'
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder='Buscar por nombre, apellidos, email, teléfono o ciclo…'
            className='bg-transparent w-full text-white placeholder:text-blue-200/40 text-sm outline-none'
          />
          {q && (
            <button
              onClick={() => { setQ(''); setPage(1) }}
              className='text-blue-200/70 hover:text-white'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          )}
        </div>
        <button
          onClick={doExport}
          disabled={!users.length}
          className='px-3.5 py-2 rounded-xl font-bold text-white text-sm flex items-center gap-1.5 disabled:opacity-60'
          style={{
            background: 'linear-gradient(135deg, #22c55e, #15803d)',
            boxShadow: '0 6px 14px rgba(34,197,94,0.4)'
          }}
        >
          <Download className='w-4 h-4' /> Exportar CSV
        </button>
      </div>

      {/* Filtros avanzados: ciclo + rango de fechas */}
      <div
        className='rounded-xl p-3 mb-3 flex flex-wrap items-end gap-3'
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
            <GraduationCap className='w-3 h-3' /> Ciclo escolar
          </span>
          <select
            value={ciclo}
            onChange={(e) => { setCiclo(e.target.value); setPage(1) }}
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

        <label className='flex flex-col gap-1 text-[11px] text-blue-200/75'>
          <span className='flex items-center gap-1'>
            <Calendar className='w-3 h-3' /> Desde
          </span>
          <input
            type='date'
            value={desde}
            onChange={(e) => { setDesde(e.target.value); setPage(1) }}
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
            onChange={(e) => { setHasta(e.target.value); setPage(1) }}
            className='rounded-md bg-slate-900/70 border border-white/10 text-white text-xs px-2 py-1.5 outline-none'
            style={{ colorScheme: 'dark' }}
          />
        </label>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className='ml-auto text-[11px] text-blue-200/85 hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-colors'
          >
            <X className='w-3 h-3' /> Limpiar ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Tabla */}
      <div
        className='rounded-2xl overflow-hidden'
        style={{
          background:
            'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
          border: '1px solid rgba(147,197,253,0.2)'
        }}
      >
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left border-collapse'>
            <thead>
              <tr className='text-blue-200/85 text-[11px] uppercase tracking-wider bg-slate-900/50'>
                <SortableTh sort={sort} dir={dir} col='id' onClick={changeSort}>#</SortableTh>
                <SortableTh sort={sort} dir={dir} col='nombre' onClick={changeSort}>Nombre</SortableTh>
                <SortableTh sort={sort} dir={dir} col='email' onClick={changeSort}>Email</SortableTh>
                <th className='px-3 py-3 font-semibold'>Teléfono</th>
                <SortableTh sort={sort} dir={dir} col='ciclo' onClick={changeSort}>Ciclo</SortableTh>
                <th className='px-3 py-3 font-semibold text-center'>Mensajes</th>
                <SortableTh sort={sort} dir={dir} col='last_login_at' onClick={changeSort}>Últ. ingreso</SortableTh>
                <SortableTh sort={sort} dir={dir} col='created_at' onClick={changeSort}>Registrado</SortableTh>
                <th className='px-3 py-3 font-semibold text-right'></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className='px-3 py-12 text-center text-blue-200/70'>
                    <Loader2 className='w-6 h-6 animate-spin mx-auto' />
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={9} className='px-3 py-12 text-center text-blue-200/70'>
                    <Users className='w-10 h-10 text-blue-300/50 mx-auto mb-2' />
                    {activeFilterCount > 0
                      ? 'No se encontraron usuarios con los filtros aplicados.'
                      : 'Aún no hay usuarios registrados.'}
                  </td>
                </tr>
              )}
              {!loading &&
                users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => openDetail(u)}
                    className='border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors'
                  >
                    <td className='px-3 py-3 text-blue-200/60 font-mono text-xs'>#{u.id}</td>
                    <td className='px-3 py-3 text-white font-semibold'>
                      <div className='flex items-center gap-2'>
                        <Avatar name={u.nombre} apellidos={u.apellidos} />
                        <div>
                          <div>{u.nombre} {u.apellidos}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 text-blue-100/90 text-[13px]'>{u.email}</td>
                    <td className='px-3 py-3 text-blue-100/80 font-mono text-[12px]'>{u.telefono}</td>
                    <td className='px-3 py-3'>
                      {u.ciclo ? (
                        <span
                          className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold'
                          style={{
                            background: 'rgba(168,85,247,0.15)',
                            color: '#d8b4fe',
                            border: '1px solid rgba(168,85,247,0.3)'
                          }}
                        >
                          <GraduationCap className='w-2.5 h-2.5' /> {u.ciclo}
                        </span>
                      ) : (
                        <span className='text-blue-200/40 text-[11px]'>—</span>
                      )}
                    </td>
                    <td className='px-3 py-3 text-center'>
                      <span
                        className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold'
                        style={{
                          background: u.message_count > 0 ? 'rgba(56,189,248,0.15)' : 'rgba(148,163,184,0.15)',
                          color: u.message_count > 0 ? '#7dd3fc' : '#94a3b8',
                          border: `1px solid ${u.message_count > 0 ? 'rgba(56,189,248,0.3)' : 'rgba(148,163,184,0.3)'}`
                        }}
                      >
                        <MessageCircle className='w-2.5 h-2.5' /> {u.message_count ?? 0}
                      </span>
                    </td>
                    <td className='px-3 py-3 text-blue-200/70 text-[12px] whitespace-nowrap'>
                      {formatDate(u.last_login_at)}
                    </td>
                    <td className='px-3 py-3 text-blue-200/70 text-[12px] whitespace-nowrap'>
                      {formatDate(u.created_at)}
                    </td>
                    <td className='px-3 py-3 text-right'>
                      <span className='text-blue-200/50 text-[10px]'>ver →</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {meta && meta.total > 0 && (
          <div className='flex items-center justify-between p-3 border-t border-white/10 text-blue-200/85 text-xs'>
            <div>
              Mostrando <b className='text-white'>{meta.from ?? 0}</b>–
              <b className='text-white'>{meta.to ?? 0}</b> de{' '}
              <b className='text-white'>{meta.total}</b>
            </div>
            <div className='flex items-center gap-1.5'>
              <label className='flex items-center gap-1'>
                <span>Por página:</span>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
                  className='rounded-md bg-slate-900/70 border border-white/10 text-white text-xs px-1.5 py-0.5 outline-none'
                >
                  {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className='w-7 h-7 rounded-md flex items-center justify-center border border-white/10 hover:bg-white/10 disabled:opacity-40'
              >
                <ChevLeft className='w-3.5 h-3.5' />
              </button>
              <span className='px-2'>
                Pág. <b className='text-white'>{meta.current_page}</b> / {meta.last_page}
              </span>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className='w-7 h-7 rounded-md flex items-center justify-center border border-white/10 hover:bg-white/10 disabled:opacity-40'
              >
                <ChevronRight className='w-3.5 h-3.5' />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer detalle */}
      <AnimatePresence>
        {selected && (
          <DetailDrawer
            user={selected}
            full={selectedFull}
            loading={loadingDetail}
            onClose={closeDetail}
            onRemove={() => removeUser(selected.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- Subcomponentes ----------

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className='rounded-xl p-3'
    style={{
      background:
        'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
      border: '1px solid rgba(147,197,253,0.2)'
    }}
  >
    <div className='flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold'
      style={{ color: color + 'ee' }}>
      <Icon className='w-3 h-3' /> {label}
    </div>
    <div className='text-white font-extrabold text-lg mt-0.5'>
      {typeof value === 'number' ? value.toLocaleString('es-MX') : (value ?? 0)}
    </div>
  </div>
)

const SortableTh = ({ children, sort, dir, col, onClick }) => {
  const active = sort === col
  return (
    <th
      onClick={() => onClick(col)}
      className='px-3 py-3 font-semibold cursor-pointer select-none whitespace-nowrap'
    >
      <span className={`inline-flex items-center gap-1 ${active ? 'text-sky-300' : ''}`}>
        {children}
        <ArrowUpDown className={`w-3 h-3 ${active ? 'opacity-100' : 'opacity-30'}`} />
        {active && <span className='text-[9px]'>{dir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  )
}

const Avatar = ({ name = '', apellidos = '' }) => {
  const initials = ((name?.[0] || '') + (apellidos?.[0] || '')).toUpperCase() || '?'
  const hue = Math.abs(hashCode(name + apellidos)) % 360
  return (
    <span
      className='w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0'
      style={{
        background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 40) % 360},70%,45%))`,
        boxShadow: '0 4px 8px rgba(0,0,0,0.25)'
      }}
    >
      {initials}
    </span>
  )
}

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i)
  return h
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString('es-MX', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  } catch {
    return iso
  }
}

const DetailDrawer = ({ user, full, loading, onClose, onRemove }) => {
  const recent = full?.recent_messages || []
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className='fixed inset-x-0 bottom-0 z-50 rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col'
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #0b1b3a 100%)',
          borderTop: '1px solid rgba(147,197,253,0.3)'
        }}
      >
        <div className='flex items-center gap-3 p-4 border-b border-white/10'>
          <Avatar name={user.nombre} apellidos={user.apellidos} />
          <div className='flex-1 min-w-0'>
            <div className='text-white font-extrabold truncate'>
              {user.nombre} {user.apellidos}
            </div>
            <div className='text-blue-200/70 text-[11px] font-mono'>#{user.id} · {user.email}</div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-white border border-white/10 hover:bg-white/10'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {/* Info básica */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <InfoRow icon={Mail} label='Email' value={user.email} />
            <InfoRow icon={Phone} label='Teléfono' value={user.telefono} />
            <InfoRow icon={GraduationCap} label='Ciclo' value={user.ciclo || '—'} />
            <InfoRow icon={Calendar} label='Registrado' value={formatDate(user.created_at)} />
            <InfoRow icon={Clock} label='Último ingreso' value={formatDate(user.last_login_at)} />
          </div>

          {/* Mensajes recientes */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <div className='text-blue-100/90 text-[13px] font-semibold flex items-center gap-1.5'>
                <MessageCircle className='w-4 h-4 text-sky-300' />
                Últimos mensajes
              </div>
              <div className='text-blue-200/70 text-[11px]'>
                {user.message_count ?? 0} en total
              </div>
            </div>

            {loading && (
              <div className='flex items-center justify-center py-6 text-blue-200/70'>
                <Loader2 className='w-5 h-5 animate-spin' />
              </div>
            )}

            {!loading && recent.length === 0 && (
              <p className='text-blue-200/70 text-[13px] text-center py-4'>
                Sin mensajes todavía.
              </p>
            )}

            <div className='space-y-2'>
              {recent.map((m) => (
                <div
                  key={m.id}
                  className='rounded-xl p-3'
                  style={{
                    background:
                      m.role === 'user'
                        ? 'rgba(56,189,248,0.12)'
                        : 'rgba(139,92,246,0.12)',
                    border: `1px solid ${m.role === 'user' ? 'rgba(56,189,248,0.25)' : 'rgba(139,92,246,0.25)'}`
                  }}
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span
                      className='text-[10px] font-bold uppercase tracking-wider'
                      style={{ color: m.role === 'user' ? '#7dd3fc' : '#c4b5fd' }}
                    >
                      {m.role === 'user' ? '👤 Usuario' : '🦅 Aquila'}
                    </span>
                    <span className='text-blue-200/60 text-[10px]'>
                      {formatDate(m.created_at)}
                    </span>
                  </div>
                  <p className='text-blue-50 text-[13px] whitespace-pre-wrap leading-relaxed'>
                    {m.content}
                  </p>
                  {m.tokens_used > 0 && (
                    <div className='text-blue-200/50 text-[10px] mt-1 flex items-center gap-2'>
                      <BarChart3 className='w-2.5 h-2.5' />
                      {m.tokens_used} tokens · {m.model_used}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='p-4 border-t border-white/10 flex gap-2'>
          <button
            onClick={onClose}
            className='flex-1 rounded-2xl py-3 text-sm font-bold text-white/85 border border-white/15 hover:bg-white/10'
          >
            Cerrar
          </button>
          <button
            onClick={onRemove}
            className='flex-1 rounded-2xl py-3 text-sm font-extrabold text-white flex items-center justify-center gap-2'
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              boxShadow: '0 10px 22px rgba(220,38,38,0.4)'
            }}
          >
            <Trash2 className='w-4 h-4' /> Eliminar
          </button>
        </div>
      </motion.div>
    </>
  )
}

const InfoRow = ({ icon: Icon, label, value }) => (
  <div
    className='rounded-xl p-3'
    style={{
      background: 'rgba(15,23,42,0.6)',
      border: '1px solid rgba(147,197,253,0.15)'
    }}
  >
    <div className='flex items-center gap-1.5 text-blue-200/60 text-[10px] uppercase tracking-wider font-semibold mb-1'>
      <Icon className='w-3 h-3' /> {label}
    </div>
    <div className='text-white text-[13px] font-medium break-words'>{value || '—'}</div>
  </div>
)

export default AdminUsersPage
