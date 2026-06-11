import { useEffect, useState } from 'react'
import { UsuariasDetails } from '../components/Usuarias/UsuariasDetails'
import { UsuariasList } from '../components/Usuarias/UsuariasList'

export default function UsuariasPage() {
  const [selectedUser, setSelectedUser] = useState(null)
  useEffect(() => {
    document.title = 'Usuarias | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <UsuariasList onSelectUser={setSelectedUser} />

      {selectedUser && (
        <UsuariasDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}
