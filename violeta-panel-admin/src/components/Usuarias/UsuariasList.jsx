import { useState, useMemo } from 'react'
import { Search, Loader2, ShieldAlert } from 'lucide-react'
import { useUsuarias } from '../../hooks/useUsuarias'
import { UsuariasCard } from './UsuariasCard'

export function UsuariasList({ onSelectUser }) {
  const { users, loading, error } = useUsuarias()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (!query.trim()) return true
      const searchText =
        `${u.nombre_completo} ${u.apellido_p} ${u.apellido_m} ${u.telefono || ''} ${u.direccion || ''}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })
  }, [users, query])

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-96 text-gray-500'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500 mb-3' />
        <p>Cargando directorio de usuarias...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8 max-w-2xl mx-auto'>
        <div className='bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-center'>
          <ShieldAlert className='w-10 h-10 text-red-500 mx-auto mb-3' />
          <h3 className='text-lg font-bold text-red-400'>
            Error al cargar datos
          </h3>
          <p className='text-red-300/80 mt-1'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='sm:p-6 max-w-[1600px] mx-auto space-y-8'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl shadow-black/20'>
        <div className='flex-1 space-y-2 w-full'>
          <h1 className='text-2xl font-bold text-white text-center xl:text-left mb-4 sm:mb-0'>
            Directorio de Usuarias
          </h1>
          <p className='text-gray-400 text-sm text-center xl:text-left'>
            Gestiona la información y perfiles de las ciudadanas registradas.
          </p>
        </div>

        <div className='relative w-full xl:max-w-xl group'>
          <Search className='w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors' />
          <input
            className='w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-medium text-gray-200 placeholder-gray-600'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Buscar por nombre, teléfono...'
          />
        </div>
      </div>

      <div className='flex items-center gap-2 px-2'>
        <span className='px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-bold border border-purple-500/30'>
          {filtered.length} Registros encontrados
        </span>
      </div>

      <UsuariasCard
        filtered={filtered}
        users={users}
        onSelectUser={onSelectUser}
      />
    </div>
  )
}
