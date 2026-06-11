import { useState, useMemo } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAlertas } from '../../hooks/useAlertas'
import { Modal } from '../ui'
import Swal from 'sweetalert2'
import { Alertas } from './Alertas'
import { Form } from './Form'

dayjs.locale('es')
dayjs.extend(relativeTime)

export function AlertasList() {
  const { alertas, loading, createAlerta, updateAlerta, deleteAlerta } =
    useAlertas()

  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'Media',
    fecha_expiracion: ''
  })

  const filtered = useMemo(() => {
    return alertas.filter((al) => {
      if (!query.trim()) return true
      const text =
        `${al.titulo} ${al.descripcion} ${al.prioridad}`.toLowerCase()
      return text.includes(query.toLowerCase())
    })
  }, [alertas, query])

  const handleCreate = () => {
    setEditingId(null)
    setFormData({
      titulo: '',
      descripcion: '',
      prioridad: 'Media',
      fecha_expiracion: ''
    })
    setShowModal(true)
  }

  const handleEdit = (al) => {
    setEditingId(al.id)
    setFormData({
      titulo: al.titulo,
      descripcion: al.descripcion,
      prioridad: al.prioridad,
      fecha_expiracion: al.fecha_expiracion
        ? dayjs(al.fecha_expiracion).format('YYYY-MM-DDTHH:mm')
        : ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      toast.error('Título y descripción son obligatorios')
      return
    }

    setSaving(true)

    const dataToSend = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
      fecha_expiracion: formData.fecha_expiracion
        ? new Date(formData.fecha_expiracion).toISOString()
        : null
    }

    try {
      if (editingId) {
        await updateAlerta(editingId, dataToSend)
        toast.success('Alerta actualizada')
      } else {
        await createAlerta(dataToSend)
        toast.success('Alerta creada exitosamente')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const darkSwal = Swal.mixin({
    background: '#1f2937',
    color: '#f3f4f6',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#374151'
  })

  const handleDelete = async (id) => {
    darkSwal
      .fire({
        title: '¿Eliminar alerta?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteAlerta(id)
            toast.success('Alerta eliminada')
          } catch (err) {
            console.error(err)
            toast.error('Error al eliminar')
          }
        }
      })
  }

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center h-96 text-gray-500'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500 mb-3' />
        <p>Cargando alertas...</p>
      </div>
    )

  return (
    <div className='p-0 md:p-6 max-w-[1600px] mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            Centro de Alertas
          </h1>
          <p className='text-gray-400 text-sm'>
            Gestiona avisos importantes y notificaciones masivas.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className='flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 border border-purple-500'
        >
          <Plus className='w-4 h-4' />
          Nueva alerta
        </button>
      </div>

      <div className='flex flex-col md:flex-row gap-4 bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-lg shadow-black/20'>
        <div className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors' />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Buscar por título, prioridad...'
            className='w-full pl-10 pr-4 py-2 bg-gray-900 hover:bg-gray-900/80 focus:bg-gray-900 border border-transparent focus:border-purple-500/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 transition-all outline-none'
          />
        </div>
      </div>

      <Alertas
        filtered={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Alerta' : 'Nueva Alerta'}
      >
        <Form
          formData={formData}
          saving={saving}
          editingId={editingId}
          setFormData={setFormData}
          setShowModal={setShowModal}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  )
}
