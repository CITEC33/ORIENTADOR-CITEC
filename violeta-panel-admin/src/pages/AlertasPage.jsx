import { useEffect } from 'react'
import { AlertasList } from '../components/Alertas/AlertasList'

export default function AlertasPage() {
  useEffect(() => {
    document.title = 'Alertas | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <AlertasList />
    </div>
  )
}
