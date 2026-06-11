import { useState, useMemo } from 'react'
import { Search, Plus, Loader2, ShieldAlert, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { Modal } from '../ui'
import { useAdmins } from '../../hooks/useAdmins'
import Swal from 'sweetalert2'
import { Admins } from './Admins'
import { Form } from './Form'

dayjs.locale('es')

export function AdminsList() {
  const { admins, loading, error, createAdmin, updateAdmin, deleteAdmin } =
    useAdmins()
  const [query, setQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    email: '',
    password: '',
    name: ''
  })

  const filtered = useMemo(() => {
    return admins.filter((a) => {
      if (!query.trim()) return true
      const searchText = `${a.email} ${a.nombre_completo || ''}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })
  }, [admins, query])

  const openCreateModal = () => {
    setIsEditing(false)
    setFormData({ id: null, email: '', password: '', name: '' })
    setShowModal(true)
  }

  const openEditModal = (admin) => {
    setIsEditing(true)
    setFormData({
      id: admin.id,
      email: admin.email,
      password: '',
      name: admin.nombre_completo
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error('El nombre es obligatorio')
      return
    }

    if (!isEditing) {
      if (!formData.email || !formData.password) {
        toast.error('Correo y contraseña son obligatorios')
        return
      }
      if (formData.password.length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres')
        return
      }
    }

    setProcessing(true)
    try {
      if (isEditing) {
        await updateAdmin(formData.id, formData.name)
        toast.success('Administrador actualizado correctamente')
      } else {
        await createAdmin(formData.email, formData.password, formData.name)
        toast.success('Administrador creado correctamente')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Error: ' + err.message)
    } finally {
      setProcessing(false)
    }
  }

  const darkSwal = Swal.mixin({
    background: '#1f2937',
    color: '#f3f4f6',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#374151'
  })

  const handleDelete = async (adminId) => {
    darkSwal
      .fire({
        title: `¿Deseas eliminar este acceso?`,
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteAdmin(adminId)
            toast.success('Acceso revocado correctamente')
          } catch (err) {
            toast.error('Error al eliminar: ' + err.message)
          }
        }
      })
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-96 text-gray-500'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500 mb-3' />
        <p>Cargando lista de acceso...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8 max-w-2xl mx-auto'>
        <div className='bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-center'>
          <ShieldAlert className='w-10 h-10 text-red-500 mx-auto mb-3' />
          <h3 className='text-lg font-bold text-red-400'>Error de Sistema</h3>
          <p className='text-red-300/80 mt-1'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='xl:p-6 max-w-[1600px] mx-auto space-y-8'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl shadow-black/20'>
        <div className='flex-1 space-y-4 w-full'>
          <h1 className='text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center xl:justify-normal gap-3'>
            <UserCog className='w-6 h-6 sm:w-8 sm:h-8 text-purple-500 shrink-0' />
            Gestión de Accesos
          </h1>
          <p className='text-gray-400 text-sm text-center xl:text-left'>
            Administra los permisos y usuarios del panel de control.
          </p>
        </div>

        <div className='flex flex-wrap sm:flex-nowrap justify-center sm:justify-normal items-center gap-4 w-full md:w-auto'>
          {/* Buscador */}
          <div className='relative group w-full xl:max-w-xl'>
            <Search className='w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors' />
            <input
              className='w-full pl-11 pr-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-sm text-gray-200 placeholder-gray-600'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Buscar administrador...'
            />
          </div>

          <button
            onClick={openCreateModal}
            className='flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/40 whitespace-nowrap border border-purple-500 w-full sm:w-auto justify-center'
          >
            <Plus className='w-4 h-4 shrink-0' />
            Nuevo admin
          </button>
        </div>
      </div>

      <Admins
        filtered={filtered}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          <div className='flex items-center gap-2'>
            <UserCog className='w-5 h-5 text-purple-500' />
            <span className='text-white'>
              {isEditing ? 'Editar administrador' : 'Nuevo administrador'}
            </span>
          </div>
        }
      >
        <Form
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          formData={formData}
          setFormData={setFormData}
          setShowModal={setShowModal}
          processing={processing}
        />
      </Modal>
    </div>
  )
}
