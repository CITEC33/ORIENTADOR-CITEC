import { TiposViolenciaAccordion } from './TiposViolenciaAccordion'

export const InformacionViolentometro = () => {
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div className='text-center space-y-4'>
        <h2 className='text-xl sm:text-3xl font-bold text-white'>
          ¿Qué es el Violentómetro?
        </h2>
        <p className='text-sm sm:text-base text-gray-300 sm:max-w-[90%] mx-auto text-left leading-relaxed'>
          Es una herramienta gráfica y didáctica que nos ayuda a visualizar las
          diferentes manifestaciones de la violencia oculta en la vida
          cotidiana. La violencia no siempre deja marcas visibles. A menudo
          comienza de manera sutil y escala con el tiempo. Reconocer los tipos
          es el primer paso para detenerla.
        </p>
      </div>

      <div className='bg-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 shadow-inner border border-purple-900/50'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-12 h-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]'></div>
          <h3 className='text-xl sm:text-2xl font-bold text-gray-100'>
            Tipos de Violencia
          </h3>
        </div>

        <TiposViolenciaAccordion />
      </div>

      <div className='bg-purple-900/40 border border-purple-500/30 text-white rounded-2xl p-4 sm:p-8 text-center shadow-lg backdrop-blur-sm'>
        <h3 className='text-xl font-bold mb-4 text-purple-200'>
          ¿Sabías que...?
        </h3>
        <p className='opacity-90 max-w-2xl mx-auto text-gray-200'>
          La violencia es cíclica. Comienza con una fase de acumulación de
          tensión, estalla en un incidente agudo y luego pasa a una fase de
          "luna de miel" o arrepentimiento. Romper este ciclo requiere apoyo
          profesional y reconocimiento de la realidad.
        </p>
      </div>
    </div>
  )
}
