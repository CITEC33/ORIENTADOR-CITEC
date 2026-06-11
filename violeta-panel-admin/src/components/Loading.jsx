import { Loader2 } from 'lucide-react'

export const Loading = () => (
  <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center'>
    <div className='text-center text-white'>
      <Loader2 className='w-12 h-12 animate-spin mx-auto mb-4' />
      <p className='text-sm font-mono'>Cargando Sistema...</p>
    </div>
  </div>
)
