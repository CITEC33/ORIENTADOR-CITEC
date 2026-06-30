import { useEffect, useState } from 'react'
import { BookOpen, CalendarDays, GraduationCap, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RefreshWrapper } from '../components/RefreshWrapper'
import students from '../assets/imgs/students-orientation.jpg'

const sections = [
  { id: 'vida', label: 'Vida UNES' },
  { id: 'recursos', label: 'Recursos UNES' },
  { id: 'admisiones', label: 'Admisiones' }
]

const cards = {
  vida: [
    {
      icon: MapPin,
      title: 'Campus UNES Durango',
      text: 'Conoce los espacios universitarios donde podras estudiar, convivir y desarrollar tu proyecto de vida.'
    },
    {
      icon: CalendarDays,
      title: 'Actividades universitarias',
      text: 'Explora experiencias academicas, culturales y deportivas para integrarte a la vida universitaria.'
    },
    {
      icon: GraduationCap,
      title: 'Acompanamiento vocacional',
      text: 'Violeta puede ayudarte a ordenar intereses, habilidades y metas antes de elegir una carrera.'
    }
  ],
  recursos: [
    {
      icon: BookOpen,
      title: 'Guia de carreras',
      text: 'Consulta areas academicas, perfiles sugeridos y opciones para comparar carreras UNES.'
    },
    {
      icon: GraduationCap,
      title: 'Perfil vocacional',
      text: 'Inicia una conversacion con Violeta para descubrir afinidades profesionales y rutas de estudio.'
    },
    {
      icon: CalendarDays,
      title: 'Planeacion de ingreso',
      text: 'Organiza documentos, dudas, fechas clave y preguntas para admisiones.'
    }
  ],
  admisiones: [
    {
      icon: GraduationCap,
      title: 'Solicitud de informacion',
      text: 'Pide orientacion sobre requisitos, becas, horarios, modalidad y proceso de inscripcion.'
    },
    {
      icon: BookOpen,
      title: 'Comparar carreras',
      text: 'Contrasta opciones por intereses, campo laboral, habilidades y proyecto de vida.'
    },
    {
      icon: MapPin,
      title: 'Visita y contacto',
      text: 'Prepara tus preguntas para conocer campus, servicios y oferta academica de Universidad Espana Durango.'
    }
  ]
}

const ComunidadPage = () => {
  const [activeSection, setActiveSection] = useState('vida')

  useEffect(() => {
    document.title = 'Vida UNES - UNES Orienta IA'
  }, [])

  return (
    <RefreshWrapper key={activeSection}>
      <div className='min-h-full pb-20'>
        <div className='max-w-6xl mx-auto p-2 sm:p-6 mt-10 lg:mt-0'>
          <div className='bg-gray-800 rounded-2xl overflow-hidden mb-10 shadow-xl shadow-black/20 border border-gray-700'>
            <div className='h-48 relative'>
              <img
                src={students}
                alt='Estudiantes en orientacion vocacional'
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent' />
            </div>
            <div className='p-5 sm:p-10 text-center'>
              <h1 className='text-3xl font-bold text-white mb-2'>
                Vida UNES
              </h1>
              <p className='text-gray-400 max-w-2xl mx-auto'>
                Recursos para conocer Universidad Espana Durango, explorar
                carreras y avanzar en tu orientacion vocacional.
              </p>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-2 md:w-fit md:mx-auto mt-8'>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                      activeSection === section.id
                        ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/50'
                        : 'bg-gray-900 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='grid gap-6 bg-gray-800 rounded-3xl p-3 sm:p-6 shadow-xl shadow-black/20 border border-gray-700'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {cards[activeSection].map((card) => (
                <article
                  key={card.title}
                  className='rounded-2xl border border-gray-700 bg-gray-900/70 p-5 hover:border-purple-500/40 transition-colors'
                >
                  <div className='w-11 h-11 rounded-xl bg-purple-600/20 text-purple-200 flex items-center justify-center mb-4'>
                    <card.icon className='w-6 h-6' />
                  </div>
                  <h2 className='text-lg font-bold text-white mb-2'>
                    {card.title}
                  </h2>
                  <p className='text-sm text-gray-400 leading-relaxed'>
                    {card.text}
                  </p>
                </article>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Link
                to='/chat'
                className='px-5 py-3 rounded-xl bg-purple-600 text-white font-bold text-center hover:bg-purple-500 transition-colors'
              >
                Hablar con Violeta
              </Link>
              <Link
                to='/carreras-unes'
                className='px-5 py-3 rounded-xl bg-gray-900 text-blue-200 border border-blue-500/40 font-bold text-center hover:bg-blue-950/40 transition-colors'
              >
                Ver carreras UNES
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RefreshWrapper>
  )
}

export default ComunidadPage
