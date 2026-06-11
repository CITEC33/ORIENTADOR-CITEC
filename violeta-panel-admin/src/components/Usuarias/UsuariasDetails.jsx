import { useMemo } from 'react'
import { Clock, Activity } from 'lucide-react'
import { Modal } from '../ui'
import { UserAvatar } from './UserAvatar'
import { useIncidentes } from '../../hooks/useIncidentes'
import { formatDate } from '../../lib/utils'
import { ContactoUsuaria } from './ContactoUsuaria'
import { RedEmergencia } from './RedEmergencia'
import { ActividadPlataforma } from './ActividadPlataforma'

export function UsuariasDetails({ user, onClose }) {
  const { incidents } = useIncidentes()

  const userIncidents = useMemo(() => {
    return incidents.filter((i) => i.user_id === user.id)
  }, [incidents, user.id])

  const stats = useMemo(() => {
    const active = userIncidents.filter((i) => i.estado === 'Activo').length
    const attended = userIncidents.filter((i) => i.estado === 'Atendido').length
    const closed = userIncidents.filter(
      (i) => i.estado === 'Cerrado' || i.estado === 'Archivado'
    ).length
    return {
      total: userIncidents.length,
      active,
      attended,
      closed
    }
  }, [userIncidents])

  const emergencyContacts = Array.isArray(user.contactos) ? user.contactos : []

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      title={
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 '>
          <span className='font-bold text-white'>Perfil de Usuaria</span>
          <span className='px-2 py-0.5 rounded-md bg-purple-900/50 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase'>
            ID: {user.id.slice(0, 8)}
          </span>
        </div>
      }
    >
      <div className='space-y-8'>
        <div className='flex items-center flex-col sm:flex-row gap-5 p-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-inner'>
          <UserAvatar
            user={user}
            size='lg'
            className='w-20 h-20 text-2xl shadow-lg ring-4 ring-gray-800'
          />
          <div>
            <h2 className='text-2xl font-black text-white leading-none mb-4 sm:mb-2 text-center sm:text-left'>
              {user.nombre_completo} {user?.apellido_p} {user?.apellido_m}
            </h2>
            <div className='flex flex-wrap items-center justify-center sm:justify-normal gap-3 text-xs font-medium text-gray-300'>
              <span className='flex items-center gap-1.5 bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-600'>
                <Clock className='w-3 h-3 shrink-0' />
                Registro: {user.fecha_formateada}
              </span>
              <span className='flex items-center gap-1.5 bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-600'>
                <Activity className='w-3 h-3 text-emerald-400 shrink-0' />
                Activa
              </span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6'>
          <div className='space-y-6'>
            <ContactoUsuaria user={user} />
            <RedEmergencia emergencyContacts={emergencyContacts} />
          </div>

          <ActividadPlataforma
            stats={stats}
            userIncidents={userIncidents}
            formatDate={formatDate}
          />
        </div>

        <div className='flex justify-end pt-4 border-t border-gray-700'>
          <button
            onClick={onClose}
            className='px-6 py-2.5 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-all border border-gray-600'
          >
            Cerrar expediente
          </button>
        </div>
      </div>
    </Modal>
  )
}
