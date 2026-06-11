import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IncidentesLista } from '../components/Incidentes/IncidentesLista'
import { IncidenteDetalles } from '../components/Incidentes/IncidenteDetalles'
import { IncidenteNotasModal } from '../components/Incidentes/IncidenteNotasModal'

export default function IncidentesPage() {
  const { search } = useLocation()
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [notesIncident, setNotesIncident] = useState(null)

  useEffect(() => {
    document.title = 'Incidentes | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 space-y-8'>
      <IncidentesLista
        key={search}
        onSelectIncident={setSelectedIncident}
        onOpenNotes={setNotesIncident}
      />

      <IncidenteDetalles
        incident={selectedIncident}
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onOpenNotes={setNotesIncident}
      />

      <IncidenteNotasModal
        incident={notesIncident}
        open={!!notesIncident}
        onClose={() => setNotesIncident(null)}
      />
    </div>
  )
}
