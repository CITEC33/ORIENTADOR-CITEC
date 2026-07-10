import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  BookOpen, ChevronLeft, Plus, RefreshCw, Search, FileText,
  Loader2, Save, Trash2, Sparkles, X, Tag, Hash, ChevronRight,
  Eye, Zap, BarChart3, AlertCircle, CheckCircle2, PowerOff, Power
} from 'lucide-react'
import { api, adminStore } from '../lib/api'

const CATEGORIES = [
  { value: 'carrera', label: 'Carrera', color: '#3b82f6' },
  { value: 'admision', label: 'Admisión', color: '#8b5cf6' },
  { value: 'beca', label: 'Beca', color: '#22c55e' },
  { value: 'modalidad', label: 'Modalidad', color: '#f59e0b' },
  { value: 'general', label: 'General', color: '#64748b' },
  { value: 'contacto', label: 'Contacto', color: '#ec4899' },
  { value: 'evento', label: 'Evento', color: '#06b6d4' }
]
const catMeta = (v) => CATEGORIES.find((c) => c.value === v) || CATEGORIES[4]

/**
 * Gestión de la base de conocimiento (RAG) del bot Aquila.
 * - Lista de documentos Markdown editables desde el admin.
 * - Editor lateral (drawer) con markdown crudo + categoría + toggle enabled.
 * - Botón "Reindexar todo" y "Preview" para probar recuperación.
 */
const AdminKnowledgePage = () => {
  const nav = useNavigate()

  const [docs, setDocs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [category, setCategory] = useState('')

  const [editing, setEditing] = useState(null) // {id?, title, category, content, enabled} o null
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewQuery, setPreviewQuery] = useState('')
  const [previewResults, setPreviewResults] = useState(null)
  const [previewing, setPreviewing] = useState(false)
  const [reindexingAll, setReindexingAll] = useState(false)

  useEffect(() => {
    if (!adminStore.isActive()) {
      nav('/admin', { replace: true })
      return
    }
    document.title = 'Base de conocimiento · Aquila'
    load()
    // eslint-disable-next-line
  }, [])

  const load = async (cat) => {
    setLoading(true)
    try {
      const r = await api.admin.knowledge.list(cat ?? category)
      setDocs(r.documents || [])
      setStats(r.stats || null)
    } catch (e) {
      if (e.status === 401) {
        adminStore.clear()
        nav('/admin', { replace: true })
      } else {
        toast.error(e.message || 'Error al cargar documentos.')
      }
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return docs
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    )
  }, [docs, filter])

  const openNew = () =>
    setEditing({ title: '', category: 'carrera', content: '', enabled: true })

  const openEdit = async (id) => {
    try {
      const r = await api.admin.knowledge.get(id)
      setEditing({ ...r.document })
    } catch (e) {
      toast.error(e.message || 'No se pudo abrir el documento.')
    }
  }

  const closeEditor = () => setEditing(null)

  const save = async () => {
    if (!editing) return
    if (!editing.title.trim()) return toast.error('Falta el título.')
    if (!editing.content.trim()) return toast.error('Falta el contenido.')

    setSaving(true)
    try {
      const payload = {
        title: editing.title.trim(),
        category: editing.category,
        content: editing.content,
        enabled: !!editing.enabled
      }
      if (editing.id) {
        await api.admin.knowledge.update(editing.id, payload)
        toast.success('Documento actualizado e indexado')
      } else {
        await api.admin.knowledge.create(payload)
        toast.success('Documento creado e indexado')
      }
      setEditing(null)
      await load()
    } catch (e) {
      toast.error(e.message || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar este documento y sus chunks?')) return
    try {
      await api.admin.knowledge.remove(id)
      toast.success('Documento eliminado')
      await load()
    } catch (e) {
      toast.error(e.message || 'No se pudo eliminar.')
    }
  }

  const reindexOne = async (id) => {
    try {
      const r = await api.admin.knowledge.reindexOne(id)
      toast.success(
        `Reindexado: ${r.stats?.chunks || 0} chunks · ${r.stats?.tokens || 0} tokens`
      )
      await load()
    } catch (e) {
      toast.error(e.message || 'Error al reindexar.')
    }
  }

  const reindexAll = async () => {
    if (!confirm('¿Reindexar TODA la base de conocimiento? Puede tardar unos segundos.'))
      return
    setReindexingAll(true)
    try {
      const r = await api.admin.knowledge.reindexAll()
      const totalChunks = (r.results || []).reduce(
        (a, x) => a + (x.chunks || 0),
        0
      )
      toast.success(
        `Reindexación completa · ${r.results?.length || 0} docs · ${totalChunks} chunks`
      )
      await load()
    } catch (e) {
      toast.error(e.message || 'Error al reindexar todo.')
    } finally {
      setReindexingAll(false)
    }
  }

  const runPreview = async () => {
    if (!previewQuery.trim()) return
    setPreviewing(true)
    setPreviewResults(null)
    try {
      const r = await api.admin.knowledge.preview(previewQuery.trim(), 4)
      setPreviewResults(r.results || [])
    } catch (e) {
      toast.error(e.message || 'Error al buscar.')
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <div className='relative min-h-full px-4 pt-6 pb-24 max-w-3xl mx-auto'>
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
            <BookOpen className='w-5 h-5 text-sky-300' /> Base de conocimiento
          </h1>
          <p className='text-blue-200/70 text-xs'>
            RAG · documentos que consulta Aquila
          </p>
        </div>
        <button
          onClick={() => setPreviewOpen(true)}
          className='px-3 py-2 rounded-xl text-xs font-semibold text-white/90 border border-white/15 hover:bg-white/10 transition-all flex items-center gap-1.5'
        >
          <Eye className='w-3.5 h-3.5' /> Preview
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className='grid grid-cols-3 gap-2 mb-4'>
          <StatCard icon={FileText} label='Documentos' value={stats.total_docs} />
          <StatCard icon={Hash} label='Chunks' value={stats.total_chunks} />
          <StatCard
            icon={BarChart3}
            label='Tokens'
            value={stats.total_tokens?.toLocaleString('es-MX') ?? 0}
          />
        </div>
      )}

      {/* Filtros y acciones */}
      <div className='flex flex-col gap-2 mb-4'>
        <div className='flex items-center gap-2'>
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder='Buscar por título, slug…'
              className='bg-transparent w-full text-white placeholder:text-blue-200/40 text-sm outline-none'
            />
          </div>
          <button
            onClick={openNew}
            className='px-3.5 py-2 rounded-xl font-bold text-white text-sm flex items-center gap-1.5'
            style={{
              background:
                'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 60%, #1e40af 100%)',
              boxShadow: '0 6px 14px rgba(37,99,235,0.45)'
            }}
          >
            <Plus className='w-4 h-4' /> Nuevo
          </button>
        </div>

        {/* Chips de categoría */}
        <div className='flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1'>
          <CategoryChip
            active={category === ''}
            onClick={() => {
              setCategory('')
              load('')
            }}
          >
            Todas
          </CategoryChip>
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.value}
              active={category === c.value}
              color={c.color}
              onClick={() => {
                setCategory(c.value)
                load(c.value)
              }}
            >
              {c.label}
            </CategoryChip>
          ))}
        </div>

        <button
          onClick={reindexAll}
          disabled={reindexingAll || !docs.length}
          className='self-start px-3 py-1.5 rounded-lg text-[11px] font-semibold text-sky-200 border border-sky-400/30 hover:bg-sky-400/10 disabled:opacity-50 flex items-center gap-1.5 transition-all'
        >
          {reindexingAll ? (
            <Loader2 className='w-3 h-3 animate-spin' />
          ) : (
            <RefreshCw className='w-3 h-3' />
          )}
          Reindexar todo
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className='flex items-center justify-center py-12 text-blue-200/70'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className='rounded-2xl p-8 text-center'
          style={{
            background:
              'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
            border: '1px dashed rgba(147,197,253,0.3)'
          }}
        >
          <BookOpen className='w-10 h-10 text-blue-300/70 mx-auto mb-2' />
          <p className='text-blue-200/85 text-sm mb-3'>
            No hay documentos {category ? `en "${catMeta(category).label}"` : 'aún'}.
          </p>
          <button
            onClick={openNew}
            className='px-4 py-2 rounded-xl text-white text-sm font-bold inline-flex items-center gap-1.5'
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            }}
          >
            <Plus className='w-4 h-4' /> Crear el primero
          </button>
        </div>
      ) : (
        <div className='space-y-2'>
          {filtered.map((d) => (
            <DocRow
              key={d.id}
              doc={d}
              onEdit={() => openEdit(d.id)}
              onRemove={() => remove(d.id)}
              onReindex={() => reindexOne(d.id)}
            />
          ))}
        </div>
      )}

      {/* Drawer editor */}
      <AnimatePresence>
        {editing && (
          <EditorDrawer
            editing={editing}
            setEditing={setEditing}
            saving={saving}
            onSave={save}
            onClose={closeEditor}
          />
        )}
      </AnimatePresence>

      {/* Drawer preview */}
      <AnimatePresence>
        {previewOpen && (
          <PreviewDrawer
            query={previewQuery}
            setQuery={setPreviewQuery}
            results={previewResults}
            loading={previewing}
            onRun={runPreview}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- Subcomponentes ----------

const StatCard = ({ icon: Icon, label, value }) => (
  <div
    className='rounded-xl p-3'
    style={{
      background:
        'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
      border: '1px solid rgba(147,197,253,0.2)'
    }}
  >
    <div className='flex items-center gap-1.5 text-blue-200/70 text-[10px] uppercase tracking-wider font-semibold'>
      <Icon className='w-3 h-3' /> {label}
    </div>
    <div className='text-white font-extrabold text-lg mt-0.5'>{value ?? 0}</div>
  </div>
)

const CategoryChip = ({ children, active, onClick, color = '#3b82f6' }) => (
  <button
    onClick={onClick}
    className='px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all'
    style={{
      background: active
        ? `linear-gradient(135deg, ${color}, ${color}cc)`
        : 'rgba(15,23,42,0.65)',
      color: active ? 'white' : 'rgba(191,219,254,0.85)',
      border: active ? 'none' : '1px solid rgba(147,197,253,0.25)',
      boxShadow: active ? `0 4px 12px ${color}55` : 'none'
    }}
  >
    {children}
  </button>
)

const DocRow = ({ doc, onEdit, onRemove, onReindex }) => {
  const cm = catMeta(doc.category)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-2xl p-3.5'
      style={{
        background:
          'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
        border: '1px solid rgba(147,197,253,0.2)'
      }}
    >
      <div className='flex items-start gap-3'>
        <div
          className='w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0'
          style={{
            background: `linear-gradient(145deg, ${cm.color}, ${cm.color}bb)`,
            boxShadow: `0 4px 10px ${cm.color}44`
          }}
        >
          <FileText className='w-5 h-5 text-white' />
        </div>
        <div className='flex-1 min-w-0'>
          <button
            onClick={onEdit}
            className='block text-left w-full'
          >
            <div className='flex items-center gap-2'>
              <span className='text-white font-bold text-[14px] truncate'>
                {doc.title}
              </span>
              {!doc.enabled && (
                <span className='text-amber-300 text-[10px] font-semibold uppercase'>
                  desactivado
                </span>
              )}
            </div>
            <div className='flex items-center gap-2 text-[11px] text-blue-200/70 mt-0.5 flex-wrap'>
              <span
                className='inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md'
                style={{
                  background: `${cm.color}22`,
                  color: cm.color,
                  border: `1px solid ${cm.color}55`
                }}
              >
                <Tag className='w-2.5 h-2.5' /> {cm.label}
              </span>
              <span className='inline-flex items-center gap-1'>
                <Hash className='w-2.5 h-2.5' /> {doc.chunk_count} chunks
              </span>
              <span className='inline-flex items-center gap-1'>
                <BarChart3 className='w-2.5 h-2.5' /> {doc.token_count} tokens
              </span>
            </div>
          </button>
        </div>
        <div className='flex flex-col gap-1'>
          <button
            onClick={onReindex}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-sky-300 border border-white/10 hover:bg-white/10 transition-all'
            title='Reindexar'
          >
            <RefreshCw className='w-3.5 h-3.5' />
          </button>
          <button
            onClick={onRemove}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-rose-300 border border-white/10 hover:bg-rose-500/10 transition-all'
            title='Eliminar'
          >
            <Trash2 className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const EditorDrawer = ({ editing, setEditing, saving, onSave, onClose }) => {
  const upd = (k, v) => setEditing((e) => ({ ...e, [k]: v }))
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
          background:
            'linear-gradient(180deg, #0f172a 0%, #0b1b3a 100%)',
          borderTop: '1px solid rgba(147,197,253,0.3)'
        }}
      >
        <div className='flex items-center gap-3 p-4 border-b border-white/10'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            <FileText className='w-4 h-4 text-white' />
          </div>
          <div className='flex-1'>
            <div className='text-white font-extrabold'>
              {editing.id ? 'Editar documento' : 'Nuevo documento'}
            </div>
            <div className='text-blue-200/70 text-[11px]'>
              Al guardar se re-chunkea y re-embebe automáticamente
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-white border border-white/10 hover:bg-white/10'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
          <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3'>
            <label className='block'>
              <span className='block text-blue-100/85 text-[11px] font-semibold uppercase tracking-wider mb-1'>
                Título
              </span>
              <input
                value={editing.title || ''}
                onChange={(e) => upd('title', e.target.value)}
                placeholder='Ej. Licenciatura en Derecho UNES'
                className='w-full rounded-xl bg-slate-900/70 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-sky-400/60'
              />
            </label>
            <label className='block'>
              <span className='block text-blue-100/85 text-[11px] font-semibold uppercase tracking-wider mb-1'>
                Categoría
              </span>
              <select
                value={editing.category}
                onChange={(e) => upd('category', e.target.value)}
                className='w-full rounded-xl bg-slate-900/70 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-sky-400/60'
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className='block'>
            <div className='flex items-center justify-between mb-1'>
              <span className='block text-blue-100/85 text-[11px] font-semibold uppercase tracking-wider'>
                Contenido (Markdown)
              </span>
              <span className='text-blue-200/70 text-[11px]'>
                {(editing.content || '').length.toLocaleString('es-MX')} chars
              </span>
            </div>
            <textarea
              value={editing.content || ''}
              onChange={(e) => upd('content', e.target.value)}
              rows={16}
              placeholder={`## Descripción\nEscribe aquí la información en Markdown.\n\n## Perfil de egreso\n...\n\n## Modalidades\n- Escolarizada\n- Sabatina\n\n## Costos\nMensualidad: $X MXN`}
              className='w-full rounded-xl bg-slate-900/70 border border-white/10 text-blue-100 text-[13px] p-3 font-mono outline-none focus:border-sky-400/60 resize-y'
            />
          </label>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => upd('enabled', !editing.enabled)}
              className='inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-semibold'
              style={{
                background: editing.enabled
                  ? 'rgba(34,197,94,0.15)'
                  : 'rgba(148,163,184,0.15)',
                border: `1px solid ${
                  editing.enabled ? 'rgba(34,197,94,0.4)' : 'rgba(148,163,184,0.35)'
                }`,
                color: editing.enabled ? '#4ade80' : '#94a3b8'
              }}
            >
              {editing.enabled ? (
                <Power className='w-3.5 h-3.5' />
              ) : (
                <PowerOff className='w-3.5 h-3.5' />
              )}
              {editing.enabled ? 'Activo' : 'Desactivado'}
            </button>
            {editing.id && (
              <div className='text-blue-200/60 text-[11px] flex-1'>
                {editing.chunk_count} chunks · {editing.token_count} tokens ·
                {editing.indexed_at
                  ? ' indexado el ' +
                    new Date(editing.indexed_at).toLocaleString('es-MX')
                  : ' sin indexar'}
              </div>
            )}
          </div>
        </div>

        <div className='p-4 border-t border-white/10 flex gap-2'>
          <button
            onClick={onClose}
            className='flex-1 rounded-2xl py-3 text-sm font-bold text-white/85 border border-white/15 hover:bg-white/10 transition-all'
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className='flex-1 rounded-2xl py-3 text-sm font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all active:scale-[0.98]'
            style={{
              background:
                'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 60%, #1e40af 100%)',
              boxShadow: '0 10px 22px rgba(37,99,235,0.5)'
            }}
          >
            {saving ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Save className='w-4 h-4' />
            )}
            Guardar e indexar
          </button>
        </div>
      </motion.div>
    </>
  )
}

const PreviewDrawer = ({ query, setQuery, results, loading, onRun, onClose }) => {
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
        className='fixed inset-x-0 bottom-0 z-50 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col'
        style={{
          background:
            'linear-gradient(180deg, #0f172a 0%, #0b1b3a 100%)',
          borderTop: '1px solid rgba(147,197,253,0.3)'
        }}
      >
        <div className='flex items-center gap-3 p-4 border-b border-white/10'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
          >
            <Sparkles className='w-4 h-4 text-white' />
          </div>
          <div className='flex-1'>
            <div className='text-white font-extrabold'>Probar recuperación</div>
            <div className='text-blue-200/70 text-[11px]'>
              ¿Qué chunks recibiría Aquila para esta pregunta?
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-white border border-white/10 hover:bg-white/10'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <div className='p-4 border-b border-white/10 flex items-center gap-2'>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onRun()}
            placeholder='Ej. ¿Cuánto cuesta la carrera de derecho?'
            className='flex-1 rounded-xl bg-slate-900/70 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-sky-400/60'
          />
          <button
            onClick={onRun}
            disabled={loading || !query.trim()}
            className='px-3.5 py-2.5 rounded-xl font-bold text-white text-sm flex items-center gap-1.5 disabled:opacity-60'
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 6px 14px rgba(139,92,246,0.4)'
            }}
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Zap className='w-4 h-4' />
            )}
            Buscar
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {results === null && !loading && (
            <p className='text-blue-200/70 text-sm text-center py-6'>
              Escribe una pregunta y toca <b>Buscar</b>.
            </p>
          )}
          {results && results.length === 0 && (
            <div
              className='rounded-2xl p-6 text-center'
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px dashed rgba(147,197,253,0.25)'
              }}
            >
              <AlertCircle className='w-8 h-8 text-amber-300 mx-auto mb-1' />
              <p className='text-blue-100 text-sm'>
                Ningún chunk relevante. Aquila responderá solo con su prompt base.
              </p>
            </div>
          )}
          {results &&
            results.map((r, i) => {
              const cm = catMeta(r.category)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className='rounded-2xl p-3.5'
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(15,23,42,0.75), rgba(30,58,138,0.35))',
                    border: '1px solid rgba(147,197,253,0.2)'
                  }}
                >
                  <div className='flex items-center gap-2 mb-1.5'>
                    <span
                      className='inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]'
                      style={{
                        background: `${cm.color}22`,
                        color: cm.color,
                        border: `1px solid ${cm.color}55`
                      }}
                    >
                      {cm.label}
                    </span>
                    <span className='text-white font-bold text-[13px] truncate flex-1'>
                      {r.doc_title}
                    </span>
                    <span
                      className='text-[10px] font-mono px-1.5 py-0.5 rounded-md'
                      style={{
                        background: 'rgba(56,189,248,0.15)',
                        color: '#7dd3fc',
                        border: '1px solid rgba(56,189,248,0.3)'
                      }}
                    >
                      {(r.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  {r.heading && (
                    <div className='text-blue-200/70 text-[11px] font-semibold mb-1'>
                      {r.heading}
                    </div>
                  )}
                  <p className='text-blue-100/90 text-[12.5px] leading-relaxed whitespace-pre-wrap'>
                    {r.content.slice(0, 300)}
                    {r.content.length > 300 && '…'}
                  </p>
                </motion.div>
              )
            })}
        </div>
      </motion.div>
    </>
  )
}

export default AdminKnowledgePage
