import { useEffect } from 'react'
import { AdminsList } from '../components/Admins/AdminsList'

export default function AdminsPage() {
  useEffect(() => {
    document.title = 'Admins | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <AdminsList />
    </div>
  )
}
