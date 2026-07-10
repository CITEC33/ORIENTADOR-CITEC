import { useEffect } from 'react'
import { BookOpen, GraduationCap, MessageCircle, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

const MisAlertasPage = () => {
  useEffect(() => {
    document.title = 'Mi Orientacion - UNES Orienta IA'
  }, [])

  return (
    <div className='min-h-full p-4 sm:p-6 lg:p-8'>
      <div className='max-w-5xl mx-auto'>
        <div className='bg-gray-800 border border-gray-700 rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/20'>
          <div className='text-center max-w-2xl mx-auto mb-8'>
            <div className='w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-200 flex items-center justify-center mx-auto mb-4'>
              <BookOpen className='w-8 h-8' />
            </div>
            <h1 className='text-3xl font-black text-white mb-3'>
              Mi Orientacion
            </h1>
            <p className='text-gray-400 leading-relaxed'>
              Guarda aqui tus avances, dudas y solicitudes de informacion para
              continuar tu proceso vocacional con Universidad Espana Durango.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <div className='rounded-2xl bg-gray-900/70 border border-gray-700 p-5'>
              <GraduationCap className='w-7 h-7 text-purple-300 mb-3' />
              <h2 className='text-lg font-bold text-white mb-2'>
                Perfil vocacional
              </h2>
              <p className='text-sm text-gray-400'>
                Inicia una conversacion para identificar intereses, habilidades
                y areas academicas afines.
              </p>
            </div>
            <div className='rounded-2xl bg-gray-900/70 border border-gray-700 p-5'>
              <Send className='w-7 h-7 text-blue-300 mb-3' />
              <h2 className='text-lg font-bold text-white mb-2'>
                Solicitudes
              </h2>
              <p className='text-sm text-gray-400'>
                Da seguimiento a preguntas sobre admisiones, becas, horarios y
                proceso de ingreso.
              </p>
            </div>
            <div className='rounded-2xl bg-gray-900/70 border border-gray-700 p-5'>
              <MessageCircle className='w-7 h-7 text-cyan-300 mb-3' />
              <h2 className='text-lg font-bold text-white mb-2'>
                Conversaciones
              </h2>
              <p className='text-sm text-gray-400'>
                Retoma tus dudas con Aquila cuando quieras comparar carreras o
                planear tu proyecto de vida.
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-dashed border-gray-600 bg-gray-900/50 p-8 text-center'>
            <h2 className='text-xl font-bold text-white mb-2'>
              Aun no tienes solicitudes registradas
            </h2>
            <p className='text-gray-400 max-w-xl mx-auto mb-6'>
              Cuando converses con Aquila o solicites informacion, este espacio
              te ayudara a organizar tus siguientes pasos.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Link
                to='/chat'
                className='px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors'
              >
                Hablar con Aquila
              </Link>
              <Link
                to='/carreras-unes'
                className='px-5 py-3 rounded-xl bg-gray-800 text-blue-200 border border-blue-500/40 font-bold hover:bg-blue-950/40 transition-colors'
              >
                Ver carreras UNES
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MisAlertasPage
