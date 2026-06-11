import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Users,
  XCircle
} from 'lucide-react'

export const Cards = ({ isLoading, stats }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <div className='bg-gray-800 p-5 rounded-2xl border-l-4 border-l-purple-500 shadow-lg shadow-black/20 hover:shadow-purple-900/10 transition-shadow group'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-sm font-bold text-purple-400 uppercase tracking-wide'>
              Usuarias
            </p>
            <h3 className='text-3xl font-black text-white mt-2'>
              {isLoading ? (
                <Loader2 className='w-6 h-6 animate-spin text-purple-500' />
              ) : (
                stats.totalUsers
              )}
            </h3>
          </div>
          <div className='p-3 bg-purple-900/30 rounded-xl group-hover:bg-purple-900/50 transition-colors border border-purple-500/20'>
            <Users className='w-6 h-6 text-purple-400' />
          </div>
        </div>
        <div className='mt-4 text-xs text-purple-400 font-medium relative z-10'>
          Registradas en la plataforma
        </div>
      </div>

      <div className='bg-gray-800 p-5 rounded-2xl border-l-4 border-l-red-500 shadow-lg shadow-black/20 hover:shadow-red-900/10 transition-shadow group relative overflow-hidden'>
        {stats.active > 0 && (
          <div className='absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none'></div>
        )}
        <div className='flex justify-between items-start relative z-10'>
          <div>
            <p className='text-sm font-bold text-red-400 uppercase tracking-wide'>
              Activos
            </p>
            <h3 className='text-3xl font-black text-white mt-2'>
              {isLoading ? (
                <Loader2 className='w-6 h-6 animate-spin text-red-500' />
              ) : (
                stats.active
              )}
            </h3>
          </div>
          <div className='p-3 bg-red-900/30 rounded-xl group-hover:bg-red-900/50 transition-colors animate-pulse border border-red-500/20'>
            <AlertTriangle className='w-6 h-6 text-red-500' />
          </div>
        </div>
        <p className='mt-4 text-xs text-red-400 font-medium relative z-10'>
          Requieren atención inmediata
        </p>
      </div>

      <div className='bg-gray-800 p-5 rounded-2xl border-l-4 border-l-amber-500 shadow-lg shadow-black/20 hover:shadow-amber-900/10 transition-shadow group'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-sm font-bold uppercase text-amber-500'>
              Atendidos
            </p>
            <h3 className='text-3xl font-black text-white mt-2'>
              {isLoading ? (
                <Loader2 className='w-6 h-6 animate-spin text-amber-500' />
              ) : (
                stats.attended
              )}
            </h3>
          </div>
          <div className='p-3 bg-amber-900/30 rounded-xl group-hover:bg-amber-900/50 transition-colors border border-amber-500/20'>
            <CheckCircle2 className='w-6 h-6 text-amber-500' />
          </div>
        </div>
        <p className='mt-4 text-xs text-amber-500/80 font-medium relative z-10'>
          Patrulla o asistencia enviada
        </p>
      </div>

      <div className='bg-gray-800 p-5 rounded-2xl border-l-4 border-l-emerald-500 shadow-lg shadow-black/20 hover:shadow-emerald-900/10 transition-shadow group'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-sm font-bold uppercase text-emerald-500'>
              Cerrados
            </p>
            <h3 className='text-3xl font-black text-white mt-2'>
              {isLoading ? (
                <Loader2 className='w-6 h-6 animate-spin text-emerald-500' />
              ) : (
                stats.closed
              )}
            </h3>
          </div>
          <div className='p-3 bg-emerald-900/30 rounded-xl group-hover:bg-emerald-900/50 transition-colors border border-emerald-500/20'>
            <XCircle className='w-6 h-6 text-emerald-500' />
          </div>
        </div>
        <p className='mt-4 text-xs text-emerald-500/80 font-medium relative z-10'>
          Casos cerrados exitosamente
        </p>
      </div>
    </div>
  )
}
