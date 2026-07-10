import { useEffect, useState } from 'react'
import {
  BookOpen,
  ExternalLink,
  Facebook,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshWrapper } from '../components/RefreshWrapper'
import studentsHero from '../assets/imgs/students-unes.jpg'
import libraryHero from '../assets/imgs/library-unes.jpg'
import { unesContact } from '../data/unesCareers'

const sections = [
  { id: 'contacto', label: 'Contacto' },
  { id: 'admisiones', label: 'Admisiones' }
]

// Cada sección muestra una foto real de UNES distinta como fondo del hero.
const heroBySection = {
  contacto: {
    image: studentsHero,
    eyebrow: 'UNES ORIENTA IA',
    title: 'Comunicarse con UNES',
    subtitle:
      'Contáctanos y recibe atención personalizada de nuestro equipo de admisiones.'
  },
  admisiones: {
    image: libraryHero,
    eyebrow: 'ADMISIONES UNES',
    title: 'Prepara tu ingreso',
    subtitle:
      'Requisitos, becas, horarios, modalidad y todo lo que necesitas para inscribirte.'
  }
}

const cards = {
  admisiones: [
    {
      icon: GraduationCap,
      title: 'Solicitud de información',
      text: 'Pide orientación sobre requisitos, becas, horarios, modalidad y proceso de inscripción.'
    },
    {
      icon: BookOpen,
      title: 'Comparar carreras',
      text: 'Contrasta opciones por intereses, campo laboral, habilidades y proyecto de vida.'
    },
    {
      icon: MapPin,
      title: 'Visita el campus',
      text: 'Av. Universidad España 7, Jardines de Durango. Conoce instalaciones y servicios.'
    }
  ]
}

const ComunidadPage = () => {
  const [activeSection, setActiveSection] = useState('contacto')

  useEffect(() => {
    document.title = 'Comunicarse con UNES · UNES Orienta IA'
  }, [])

  return (
    <RefreshWrapper key={activeSection}>
      <div className='min-h-full pb-20'>
        <div className='max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 mt-10 lg:mt-0'>
          {/* Hero — foto real de UNES a pantalla completa con overlay elegante */}
          {(() => {
            const hero = heroBySection[activeSection] || heroBySection.contacto
            return (
              <div
                className='relative rounded-3xl overflow-hidden mb-6 border'
                style={{
                  borderColor: 'rgba(147,197,253,0.22)',
                  boxShadow: '0 18px 40px rgba(2,13,51,0.45)'
                }}
              >
                {/* Imagen de fondo con crossfade al cambiar de sección */}
                <div className='relative h-[320px] sm:h-[380px]'>
                  <AnimatePresence mode='wait'>
                    <motion.img
                      key={hero.image}
                      src={hero.image}
                      alt={hero.title}
                      className='absolute inset-0 w-full h-full object-cover'
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      draggable={false}
                    />
                  </AnimatePresence>

                  {/* Overlay: azul UNES arriba+abajo, transparente en el centro */}
                  <div
                    className='absolute inset-0'
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(8,26,76,0.55) 0%, rgba(8,26,76,0.25) 35%, rgba(8,26,76,0.7) 75%, rgba(8,26,76,0.95) 100%)'
                    }}
                  />

                  {/* Glow lateral para dar volumen */}
                  <div
                    aria-hidden
                    className='absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-40 blur-3xl'
                    style={{
                      background:
                        'radial-gradient(circle, rgba(96,165,250,0.75) 0%, transparent 70%)'
                    }}
                  />

                  {/* Contenido superpuesto */}
                  <div className='relative h-full flex flex-col items-center justify-end text-center px-5 pb-6'>
                    {/* Icono de mail flotante */}
                    <div
                      className='w-14 h-14 rounded-2xl flex items-center justify-center mb-4'
                      style={{
                        background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
                        border: '1px solid rgba(147,197,253,0.45)',
                        boxShadow:
                          '0 10px 26px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.28)'
                      }}
                    >
                      <Mail className='w-7 h-7 text-white' />
                    </div>
                    <AnimatePresence mode='wait'>
                      <motion.div
                        key={`hdr-${activeSection}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className='flex flex-col items-center'
                      >
                        <p
                          className='text-sky-200 text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.28em] mb-2'
                          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                        >
                          {hero.eyebrow}
                        </p>
                        <h1
                          className='text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight'
                          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
                        >
                          {hero.title}
                        </h1>
                        <p
                          className='text-blue-100/90 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base'
                          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                        >
                          {hero.subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Tabs — debajo de la foto, sobre panel oscuro sólido */}
                <div
                  className='px-4 sm:px-6 py-4'
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(8,26,76,0.95), rgba(2,13,51,0.85))',
                    borderTop: '1px solid rgba(147,197,253,0.15)'
                  }}
                >
                  <div className='grid grid-cols-3 gap-2 max-w-md mx-auto'>
                    {sections.map((section) => {
                      const active = activeSection === section.id
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
                            active
                              ? 'text-white'
                              : 'text-blue-200/80 hover:text-white'
                          }`}
                          style={
                            active
                              ? {
                                  background:
                                    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                  boxShadow:
                                    '0 6px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.18)'
                                }
                              : {
                                  background: 'rgba(8,26,76,0.6)',
                                  border: '1px solid rgba(147,197,253,0.18)'
                                }
                          }
                        >
                          {section.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })()}

          <AnimatePresence mode='wait'>
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {activeSection === 'contacto' ? (
                <ContactPanel />
              ) : (
                <div
                  className='rounded-3xl p-4 sm:p-6 border'
                  style={{
                    background:
                      'linear-gradient(165deg, rgba(30,64,175,0.35) 0%, rgba(8,26,76,0.6) 100%)',
                    borderColor: 'rgba(147,197,253,0.2)',
                    boxShadow: '0 12px 32px rgba(2,13,51,0.4)'
                  }}
                >
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {cards[activeSection].map((card) => (
                      <article
                        key={card.title}
                        className='rounded-2xl p-5 border'
                        style={{
                          background: 'rgba(8,26,76,0.55)',
                          borderColor: 'rgba(147,197,253,0.18)'
                        }}
                      >
                        <div
                          className='w-12 h-12 rounded-xl flex items-center justify-center mb-4'
                          style={{
                            background:
                              'linear-gradient(145deg, #3b82f6, #1d4ed8)',
                            boxShadow:
                              '0 6px 14px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}
                        >
                          <card.icon className='w-6 h-6 text-white' />
                        </div>
                        <h2 className='text-lg font-bold text-white mb-2 tracking-tight'>
                          {card.title}
                        </h2>
                        <p className='text-sm text-blue-100/80 leading-relaxed'>
                          {card.text}
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className='flex flex-col sm:flex-row gap-3 justify-center mt-6'>
                    <Link
                      to='/chat'
                      className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold'
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        boxShadow:
                          '0 6px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.18)'
                      }}
                    >
                      <MessageCircle className='w-5 h-5' />
                      Hablar con Aquila
                    </Link>
                    <Link
                      to='/carreras-unes'
                      className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sky-100 font-bold'
                      style={{
                        background: 'rgba(8,26,76,0.6)',
                        border: '1px solid rgba(147,197,253,0.3)'
                      }}
                    >
                      <GraduationCap className='w-5 h-5' />
                      Ver oferta educativa
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </RefreshWrapper>
  )
}

const ContactCard = ({ icon: Ic, label, value, href, accent = false }) => {
  const inner = (
    <div
      className='flex items-center gap-4 p-4 rounded-2xl border h-full'
      style={{
        background: accent
          ? 'linear-gradient(135deg, rgba(59,130,246,0.55), rgba(29,78,216,0.85))'
          : 'rgba(8,26,76,0.6)',
        borderColor: accent
          ? 'rgba(147,197,253,0.45)'
          : 'rgba(147,197,253,0.18)',
        boxShadow: accent
          ? '0 8px 22px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
          : '0 6px 18px rgba(2,13,51,0.3)'
      }}
    >
      <div
        className='w-11 h-11 shrink-0 rounded-xl flex items-center justify-center'
        style={{
          background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <Ic className='w-5 h-5 text-white' />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-[10px] uppercase tracking-[0.2em] text-sky-300/85 font-bold'>
          {label}
        </p>
        <p className='text-white font-semibold text-sm sm:text-base truncate'>
          {value}
        </p>
      </div>
      {href && (
        <ExternalLink className='w-4 h-4 text-blue-200/70 shrink-0' />
      )}
    </div>
  )
  return href ? (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='block hover:-translate-y-0.5 transition-transform'
    >
      {inner}
    </a>
  ) : (
    inner
  )
}

const ContactPanel = () => {
  const c = unesContact
  return (
    <div
      className='rounded-3xl p-4 sm:p-6 border'
      style={{
        background:
          'linear-gradient(165deg, rgba(30,64,175,0.35) 0%, rgba(8,26,76,0.6) 100%)',
        borderColor: 'rgba(147,197,253,0.2)',
        boxShadow: '0 12px 32px rgba(2,13,51,0.4)'
      }}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <ContactCard
          icon={Phone}
          label='Teléfono'
          value={c.phonePretty}
          href={`tel:${c.phone}`}
          accent
        />
        <ContactCard
          icon={MessageCircle}
          label='WhatsApp'
          value={c.whatsappPretty}
          href={`https://wa.me/${c.whatsapp.replace('+', '')}`}
        />
        <ContactCard
          icon={Mail}
          label='Correo'
          value={c.email}
          href={`mailto:${c.email}`}
        />
        <ContactCard
          icon={MapPin}
          label='Campus Durango'
          value='Jardines de Durango, CP 34200'
          href='https://maps.google.com/?q=Av+Universidad+Espa%C3%B1a+7+Jardines+de+Durango'
        />
        <ContactCard
          icon={Facebook}
          label='Facebook'
          value='@vidaUNES'
          href={c.facebook}
        />
        <ContactCard
          icon={Twitter}
          label='Twitter / X'
          value='@VidaUNES'
          href={c.twitter}
        />
      </div>

      <div
        className='mt-5 rounded-2xl p-4 sm:p-5 border'
        style={{
          background: 'rgba(8,26,76,0.55)',
          borderColor: 'rgba(147,197,253,0.18)'
        }}
      >
        <p className='text-[10px] uppercase tracking-[0.2em] text-sky-300/85 font-bold mb-2'>
          Dirección
        </p>
        <p className='text-white text-sm sm:text-base leading-relaxed'>
          {c.address}
        </p>
      </div>

      <div className='flex flex-col sm:flex-row gap-3 justify-center mt-5'>
        <Link
          to='/chat'
          className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold'
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            boxShadow:
              '0 6px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.18)'
          }}
        >
          <MessageCircle className='w-5 h-5' />
          Hablar con Aquila
        </Link>
        <a
          href={c.website}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sky-100 font-bold'
          style={{
            background: 'rgba(8,26,76,0.6)',
            border: '1px solid rgba(147,197,253,0.3)'
          }}
        >
          <ExternalLink className='w-5 h-5' />
          Sitio oficial unes.edu.mx
        </a>
      </div>
    </div>
  )
}

export default ComunidadPage
