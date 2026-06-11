import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldAlert,
  Terminal,
  LayoutDashboard,
  ChevronLeft
} from 'lucide-react'
import { useEffect } from 'react'

export default function Page404() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title =
      '404 | Página no encontrada - Violeta Panel de Administración'
  }, [])

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-mono text-slate-400'>
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'></div>

      <div className='relative z-10 w-full max-w-2xl'>
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden'
        >
          {/* Terminal Header */}
          <div className='bg-slate-800/50 px-4 py-2 flex items-center gap-2 border-b border-slate-800'>
            <div className='flex gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-red-500/80'></div>
              <div className='w-3 h-3 rounded-full bg-amber-500/80'></div>
              <div className='w-3 h-3 rounded-full bg-emerald-500/80'></div>
            </div>
            <div className='ml-4 text-xs font-bold text-slate-500 flex items-center gap-2'>
              <Terminal className='w-3 h-3' />
              admin_system_error.log
            </div>
          </div>

          {/* Terminal Body */}
          <div className='p-8'>
            <div className='flex items-start gap-6 mb-8'>
              <div className='hidden md:flex bg-red-500/10 p-4 rounded-xl border border-red-500/20'>
                <ShieldAlert className='w-12 h-12 text-red-500' />
              </div>

              <div className='space-y-4 flex-1'>
                <h1 className='text-3xl font-bold text-slate-100 font-sans tracking-tight'>
                  404 | Página no encontrada
                </h1>
                <p className='text-sm leading-relaxed'>
                  El sistema no puede encontrar la ruta solicitada. Es posible
                  que la página haya sido movida, eliminada o nunca haya
                  existido.
                </p>

                <div className='bg-black/30 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-2'>
                  <p className='text-red-400'>Error: PATH_NOT_FOUND</p>
                  <p className='text-slate-500'>
                    Timestamp: {new Date().toISOString()}
                  </p>
                  <p className='text-slate-500'>
                    User_Agent: {navigator.userAgent.slice(0, 40)}...
                  </p>
                  <p className='flex items-center gap-2'>
                    Status:{' '}
                    <span className='bg-red-500/20 text-red-400 px-1.5 rounded'>
                      Critical
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800 font-sans'>
              <Link
                to='/'
                className='flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold text-sm transition-all'
              >
                <LayoutDashboard className='w-4 h-4' />
                Panel de control
              </Link>

              <button
                onClick={() => navigate(-1)}
                className='flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-lg font-bold text-sm transition-all border border-slate-700'
              >
                <ChevronLeft className='w-4 h-4' />
                Regresar
              </button>
            </div>
          </div>
        </motion.div>

        <div className='mt-6 text-center'>
          <p className='text-xs text-slate-600 font-sans'>
            Dirección Municipal de Seguridad Pública • Sistema Violeta
          </p>
        </div>
      </div>
    </div>
  )
}
