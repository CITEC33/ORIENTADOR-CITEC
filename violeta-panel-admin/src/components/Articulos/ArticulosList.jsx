import { useState, useMemo } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useArticulos } from '../../hooks/useArticulos'
import { Modal } from '../ui'
import Swal from 'sweetalert2'
import { Articulos } from './Articulos'
import { Form } from './Form'

dayjs.locale('es')
dayjs.extend(relativeTime)

export function ArticulosList() {
  const { articulos, loading, createArticulo, updateArticulo, deleteArticulo } =
    useArticulos()

  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    imagen: '',
    titulo: '',
    descripcion: '',
    concepto_clave: '',
    contenido: ''
  })

  const filtered = useMemo(() => {
    return articulos.filter((art) => {
      if (!query.trim()) return true
      const text =
        `${art.titulo} ${art.descripcion} ${art.concepto_clave}`.toLowerCase()
      return text.includes(query.toLowerCase())
    })
  }, [articulos, query])

  const handleCreate = () => {
    setEditingId(null)
    setFormData({
      imagen: '',
      titulo: '',
      descripcion: '',
      concepto_clave: '',
      contenido: ''
    })
    setShowModal(true)
  }

  const handleEdit = (art) => {
    setEditingId(art.id)
    setFormData({
      imagen: art.imagen,
      titulo: art.titulo,
      descripcion: art.descripcion,
      concepto_clave: art.concepto_clave,
      contenido: art.contenido
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      (!editingId && !formData.imagen) ||
      !formData.titulo.trim() ||
      !formData.contenido.trim()
    ) {
      toast.error('Imagen, Título y Contenido son obligatorios')
      return
    }

    setSaving(true)

    try {
      if (editingId) {
        await updateArticulo(editingId, formData)
        toast.success('Artículo actualizado')
      } else {
        await createArticulo(formData)
        toast.success('Artículo creado exitosamente')
      }
      setShowModal(false)
    } catch (err) {
      console.error(err)
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
        title: '¿Eliminar artículo?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteArticulo(id)
            toast.success('Artículo eliminado')
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
        <p>Cargando artículos...</p>
      </div>
    )

  return (
    <div className='p-0 md:p-6 max-w-[1600px] mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            Biblioteca de Artículos
          </h1>
          <p className='text-gray-400 text-sm'>
            Gestiona el contenido educativo e informativo.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className='flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 border border-purple-500'
        >
          <Plus className='w-4 h-4' />
          Nuevo artículo
        </button>
      </div>

      <div className='flex flex-col md:flex-row gap-4 bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-lg shadow-black/20'>
        <div className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors' />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Buscar por título, concepto clave...'
            className='w-full pl-10 pr-4 py-2 bg-gray-900 hover:bg-gray-900/80 focus:bg-gray-900 border border-transparent focus:border-purple-500/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 transition-all outline-none'
          />
        </div>
      </div>

      <Articulos
        filtered={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
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
