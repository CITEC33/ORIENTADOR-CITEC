import { useEffect } from 'react'
import { ArticulosList } from '../components/Articulos/ArticulosList'

export default function ArticulosPage() {
  useEffect(() => {
    document.title = 'Artículos | Violeta - Panel de administración'
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <ArticulosList />
    </div>
  )
}
