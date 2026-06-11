import { TestViolentometro } from './Test/TestViolentometro'

export const IdentificacionViolentometro = () => {
  return (
    <div
      className='bg-purple-900/20 rounded-3xl p-4 sm:p-8 md:p-12 text-center border border-purple-500/20 shadow-lg backdrop-blur-sm'
      id='test'
    >
      <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4'>
        ¿Te identificas con alguna de estas situaciones?
      </h2>
      <p className='text-gray-400 mb-8 max-w-xl mx-auto text-sm sm:text-base'>
        No minimices lo que sientes. Realiza un autodiagnóstico confidencial
        para recibir orientación específica. Marca la opción que mejor describa
        tu situación en los últimos 6 meses:
      </p>

      <TestViolentometro />
    </div>
  )
}
