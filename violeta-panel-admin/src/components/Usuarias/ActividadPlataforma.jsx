import { History, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ActividadPlataforma = ({ stats, userIncidents, formatDate }) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest ml-1'>
        Actividad en Plataforma
      </h3>

      <div className='grid grid-cols-2 gap-3'>
        <div className='p-4 bg-gray-800 rounded-2xl border border-gray-700 text-center'>
          <div className='text-2xl font-black text-white'>{stats.total}</div>
          <div className='text-[10px] sm:text-sm font-bold text-gray-400 uppercase'>
            Reportes Totales
          </div>
        </div>
        <div className='p-4 bg-red-900/20 rounded-2xl border border-red-500/30 text-center'>
          <div className='text-2xl font-black text-red-500'>{stats.active}</div>
          <div className='text-[10px] sm:text-sm font-bold text-red-400 uppercase'>
            Activos Ahora
          </div>
        </div>
      </div>

      <div className='bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex-1'>
        <div className='bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center'>
          <span className='font-bold text-gray-400'>Incidentes activos</span>
          <ShieldCheck size={25} className='text-gray-500 shrink-0' />
        </div>

        <div className='divide-y divide-gray-700 max-h-[200px] overflow-y-auto'>
          {userIncidents.length > 0 ? (
            userIncidents
              .filter((i) => i.estado === 'Activo')
              .map((incident) => (
                <Link
                  to={`/incidentes?id=${incident.folio}&nombre=${encodeURIComponent(`${incident.usuarias.nombre_completo} ${incident.usuarias.apellido_p} ${incident.usuarias.apellido_m}`)}`}
                  key={incident.folio}
                  className='p-3 hover:bg-gray-700/30 transition-colors flex justify-between items-center'
                >
                  <div>
                    <span className='font-mono font-bold text-purple-400 bg-purple-900/30 px-1.5 py-0.5 rounded border border-purple-500/20'>
                      #{incident.folio}
                    </span>
                    <div className='text-xs text-gray-400 font-medium mt-1'>
                      {formatDate(incident.fecha_activacion)}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${
                      incident.estado === 'Activo'
                        ? 'bg-red-900/30 text-red-400 border-red-500/30'
                        : incident.estado === 'Atendido'
                          ? 'bg-amber-900/30 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {incident.estado}
                  </span>
                </Link>
              ))
          ) : (
            <div className='p-8 text-center text-xs text-gray-500'>
              Sin actividad registrada
            </div>
          )}
        </div>
      </div>

      <div className='bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex-1'>
        <div className='bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center'>
          <span className='font-bold text-gray-400'>Reportes anteriores</span>
          <History size={25} className='text-gray-500 shrink-0' />
        </div>

        <div className='divide-y divide-gray-700 max-h-[200px] overflow-y-auto'>
          {userIncidents.length > 0 ? (
            userIncidents
              .filter((i) => i.estado !== 'Activo')
              .map((incident) => (
                <Link
                  to={`/incidentes?id=${incident.folio}&nombre=${encodeURIComponent(`${incident.usuarias.nombre_completo} ${incident.usuarias.apellido_p} ${incident.usuarias.apellido_m}`)}`}
                  key={incident.folio}
                  className='p-3 hover:bg-gray-700/30 transition-colors flex justify-between items-center'
                >
                  <div>
                    <span className='font-mono font-bold text-purple-400 bg-purple-900/30 px-1.5 py-0.5 rounded border border-purple-500/20'>
                      #{incident.folio}
                    </span>
                    <div className='text-xs text-gray-400 font-medium mt-1'>
                      {formatDate(incident.fecha_activacion)}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${
                      incident.estado === 'Activo'
                        ? 'bg-red-900/30 text-red-400 border-red-500/30'
                        : incident.estado === 'Atendido'
                          ? 'bg-amber-900/30 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {incident.estado}
                  </span>
                </Link>
              ))
          ) : (
            <div className='p-8 text-center text-xs text-gray-500'>
              Sin actividad registrada
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
