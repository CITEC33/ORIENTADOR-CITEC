import { FileText, ShieldCheck } from 'lucide-react'

export const CardsDirectorioAyuda = () => {
  return (
    <div className='grid md:grid-cols-2 gap-4 mb-10'>
      <div className='bg-gray-900 rounded-2xl p-5 border border-purple-500/30 shadow-lg hover:shadow-purple-900/20 transition-all relative overflow-hidden group'>
        <div className='absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-purple-900/20 to-transparent opacity-50 pointer-events-none' />

        <div className='flex items-center gap-3 mb-3 border-b border-gray-700 pb-3'>
          <div className='p-2 bg-purple-900/40 rounded-lg text-purple-400 shrink-0'>
            <ShieldCheck className='w-5 h-5' />
          </div>
          <h2 className='text-lg font-bold text-white leading-none'>
            Tus Derechos Básicos
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-x-4 gap-y-2'>
          {[
            'Atención médica/psicológica gratuita.',
            'Orden de protección urgente.',
            'Asesoría legal durante todo el proceso.',
            'Trato digno y no revictimizante.'
          ].map((item, i) => (
            <div
              key={i}
              className='flex gap-2 items-start text-sm text-gray-400'
            >
              <span className='text-purple-500'>●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-gray-900 rounded-2xl p-5 border border-blue-500/30 shadow-lg hover:shadow-blue-900/20 transition-all relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-900/20 to-transparent opacity-50 pointer-events-none' />

        <div className='flex items-center gap-3 mb-3 border-b border-gray-700 pb-3'>
          <div className='p-2 bg-blue-900/40 rounded-lg text-blue-400 shrink-0'>
            <FileText className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-white leading-none'>
              Para Denunciar
            </h2>
            <p className='text-xs text-blue-300 mt-2 italic font-medium'>
              * Si es emergencia, te atenderán sin documentos.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-x-4 gap-y-2'>
          {[
            'Identificación oficial (INE/Pasaporte).',
            'Comprobante de domicilio.',
            'Narración de hechos (fechas/lugares).',
            'Pruebas (fotos, mensajes, partes).'
          ].map((item, i) => (
            <div
              key={i}
              className='flex gap-2 items-start text-sm text-gray-400'
            >
              <span className='text-blue-500'>●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
