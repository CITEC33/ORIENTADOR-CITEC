import { useEffect } from 'react'
import { EventosList } from '../components/Eventos/EventosList'

export default function EventosPage() {
  useEffect(() => {
    document.title = 'Eventos | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <EventosList />
    </div>
  )
}
