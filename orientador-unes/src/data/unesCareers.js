// Oferta educativa UNES Durango - scrapeada desde https://unes.edu.mx/Durango/estudios/licenciatura
// Última actualización: 2026-06-30

export const unesContact = {
  name: 'Universidad España',
  shortName: 'UNES',
  city: 'Durango, Durango',
  address:
    'Av. Universidad España 7, Jardines de Durango, 34200 Durango, Dgo., México',
  phone: '6188339000',
  phonePretty: '618 833 9000',
  whatsapp: '+526181709766',
  whatsappPretty: '618 170 9766',
  email: 'informes@unes.edu.mx',
  website: 'https://unes.edu.mx',
  campusOnline: 'https://campus.unes.edu.mx/',
  facebook: 'https://www.facebook.com/vidaUNES',
  twitter: 'https://twitter.com/VidaUNES'
}

// Modalidades disponibles en la UNES Durango
export const unesModalidades = [
  {
    id: 'cuatrimestre',
    nombre: 'Cuatrimestre',
    detalle: 'Presencial, plan acelerado en 3 años. Clases entre semana.'
  },
  {
    id: 'virtual',
    nombre: 'Virtual',
    detalle: 'Campus en línea, flexible y a tu ritmo. Acceso a campus.unes.edu.mx.'
  },
  {
    id: 'sabatino',
    nombre: 'Sabatino Ejecutivo',
    detalle: 'Ideal si trabajas o tienes hijos. Clases únicamente los sábados.'
  }
]

// Genérica de respaldo, usada cuando UNES no publica un párrafo "Sé un líder..."
const fallbackDescription =
  'Carrera ofertada por Universidad España con enfoque profesional y práctico. Te formarás en los conocimientos, habilidades y valores necesarios para destacar en tu área y contribuir a la sociedad.'

// Descripciones enriquecidas con el párrafo "Sé un líder..." del sitio oficial
const careerDescriptions = {
  // Ciencias Empresariales
  'gastronomia-y-gestion-turistica':
    'Sé un líder de la industria gastronómica y turística. Te formarás como profesional capaz de crear, dirigir y operar establecimientos de alimentos y bebidas con estándares internacionales, combinando arte culinario, administración y cultura turística.',
  'administracion-empresarial':
    'Sé un líder del ramo administrativo. Desarrollarás habilidades para planear, organizar, dirigir y controlar organizaciones de cualquier giro, optimizando recursos humanos, financieros y materiales con visión estratégica.',
  'contaduria-publica':
    'Sé un líder del área contable y financiera. Te prepararás para diseñar, operar y dictaminar sistemas contables, fiscales y de auditoría, generando información clave para la toma de decisiones en empresas y gobierno.',
  'hoteleria-y-turismo':
    'Sé un líder de la industria hotelera. Aprenderás a planear, dirigir y operar hoteles, agencias y servicios turísticos con calidad internacional, dominando idiomas, servicio al cliente y administración del sector.',
  'mercadotecnia':
    'Sé un líder del ramo comercial. Diseñarás estrategias de mercado, branding, ventas y publicidad digital para posicionar productos y servicios, analizando comportamiento del consumidor y tendencias del mercado.',

  // Ciencias Jurídicas y Sociales
  'criminologia-criminalistica-y-tecnicas-periciales':
    'Sé un líder del ramo legal. Contarás con la capacitación para desarrollar y aplicar tus habilidades en la prevención del delito, la investigación técnica forense y la readaptación social, manejando recursos tecnológicos de apoyo a la investigación criminalística, la prosecución del delito y la administración de justicia.',
  'ciencias-politicas-en-relaciones-internacionales':
    'Sé un líder del ámbito internacional. Te formarás en política exterior, derecho internacional, diplomacia y negociación, con dominio de idiomas y comprensión de los procesos globales económicos, políticos y sociales.',
  'ciencias-politicas-en-administracion-publica':
    'Sé un líder del servicio público. Desarrollarás habilidades para diseñar, gestionar y evaluar políticas públicas, programas de gobierno e instituciones, con sentido ético y orientación al bien común.',
  'derecho':
    'Sé un líder del ramo jurídico. Te formarás como abogado capaz de interpretar y aplicar las leyes, defender derechos y resolver controversias en materia civil, penal, mercantil, laboral y constitucional, con sentido humanista y ético.',

  // Educación
  'educacion-bilinguee':
    'Sé un líder de la educación bilingüe. Te prepararás para diseñar y aplicar procesos educativos en español e inglés con metodologías actuales, integrando cultura, didáctica y tecnología para formar estudiantes globales.',
  'educacion-especial':
    'Sé un líder de la educación inclusiva. Aprenderás a diseñar e implementar estrategias educativas para personas con discapacidad o aptitudes sobresalientes, promoviendo igualdad de oportunidades y desarrollo integral.',
  'actividad-fisica-y-deporte':
    'Sé un líder del ramo deportivo. Contarás con preparación para promover salud integral a través de la actividad física, diseñar programas de entrenamiento, dirigir equipos deportivos y aplicar ciencias del movimiento humano.',

  // Ciencias de la Comunicación
  'relaciones-publicas-e-imagen-corporativa':
    'Sé un líder de la comunicación estratégica. Diseñarás campañas de imagen pública, relaciones con medios y gestión de crisis para construir y proteger la reputación de personas, marcas e instituciones.',
  'periodismo':
    'Sé un líder del periodismo profesional. Te formarás para investigar, redactar y difundir información veraz, oportuna y relevante en medios impresos, digitales, radio y televisión, con apego a la ética informativa.',
  'publicidad':
    'Sé un líder del ramo publicitario. Crearás campañas creativas e integradas, desde la conceptualización hasta la producción, dominando estrategias digitales, medios tradicionales y análisis del consumidor.',

  // Diseño y Animación
  'animacion-y-arte-digital':
    'Sé un líder del arte digital. Te formarás en animación 2D y 3D, modelado, ilustración, videojuegos y efectos visuales, combinando creatividad, narrativa y dominio de software profesional.',
  'diseno-industrial':
    'Sé un líder del diseño de productos. Aprenderás a crear, prototipar y producir objetos funcionales, ergonómicos y sustentables, integrando materiales, procesos de manufactura y experiencia de usuario.',
  'diseno-grafico':
    'Sé un líder del diseño visual. Desarrollarás identidad gráfica, editorial, packaging, ilustración y diseño digital con dominio de software profesional, semiótica y estrategia de comunicación visual.',

  // Ciencias Médicas
  'nutricion-y-bienestar-integral':
    'Sé un líder del bienestar integral. Te formarás como nutriólogo capaz de evaluar, diseñar y dar seguimiento a planes alimentarios personalizados, promoviendo hábitos saludables y prevención de enfermedades.',
  'medico-cirujano':
    'Sé un líder del ramo médico. Contarás con la preparación adecuada en ciencias médicas básicas y el conocimiento del desarrollo, estructura y funcionamiento del organismo humano normal y anormal, con sentido humanístico y vocación de servicio.',
  'protesis-dental':
    'Sé un líder en rehabilitación oral. Te prepararás para diseñar, fabricar y adaptar prótesis dentales con alta precisión técnica y estética, dominando materiales, biomecánica y atención al paciente.',
  'medico-cirujano-odontologo':
    'Sé un líder de la odontología. Te formarás para prevenir, diagnosticar y tratar enfermedades del sistema estomatognático, con dominio de cirugía oral, rehabilitación, ortodoncia y odontología estética.',
  'ciencias-de-la-enfermeria':
    'Sé un líder del cuidado de la salud. Desarrollarás competencias para brindar atención de enfermería integral en hospitales, clínicas y comunidad, con sólida base científica, ética y humanística.',
  'psicologia-clinica':
    'Sé un líder de la salud mental. Te formarás para evaluar, diagnosticar e intervenir en problemas emocionales, conductuales y psicológicos, con enfoques terapéuticos actuales y sensibilidad humana.',
  'psicologia-educativa':
    'Sé un líder de los procesos de aprendizaje. Aprenderás a evaluar y acompañar el desarrollo cognitivo, emocional y social en contextos escolares, diseñando intervenciones que potencien el aprendizaje.',

  // Ingeniería Superior
  'arquitectura':
    'Sé un líder del diseño y la construcción. Te formarás como arquitecto capaz de proyectar, planear y dirigir obras con criterios estéticos, funcionales, estructurales y sustentables, integrando tecnología BIM y normatividad.',
  'ingeniero-en-tecnologias-y-sistemas-de-informacion':
    'Sé un líder de la transformación digital. Desarrollarás software, redes, ciberseguridad e inteligencia de datos, con dominio de programación, arquitectura de sistemas y gestión de proyectos tecnológicos.',
  'ingeniero-mecanico-administrador':
    'Sé un líder de la industria. Combinarás conocimientos de ingeniería mecánica con administración de operaciones, mantenimiento, calidad y producción, optimizando procesos industriales y recursos.',
  'ingeniero-mecanico-electricista':
    'Sé un líder de la energía y la automatización. Te formarás en diseño, instalación y mantenimiento de sistemas mecánicos y eléctricos industriales, con enfoque en eficiencia energética y automatización.',
  'ingeniero-mecanico-en-maquinaria-automotriz':
    'Sé un líder de la industria automotriz. Aprenderás diseño, diagnóstico, mantenimiento y desarrollo de sistemas mecánicos, eléctricos y electrónicos del automóvil, incluyendo nuevas tecnologías híbridas y eléctricas.',
  'ingeniero-en-geologia':
    'Sé un líder de las ciencias de la tierra. Te formarás para explorar, estudiar y aprovechar recursos minerales, hídricos y energéticos, con dominio de geofísica, geoquímica, cartografía y sustentabilidad ambiental.'
}

// Modalidades por defecto (todas las carreras de UNES Durango se ofrecen así salvo casos médicos)
const defaultModalidades = ['cuatrimestre', 'virtual', 'sabatino']
const onlyPresencial = ['cuatrimestre']

// Modalidades específicas por carrera (las clínicas presenciales no se ofertan en virtual)
const modalidadesPorSlug = {
  'medico-cirujano': onlyPresencial,
  'medico-cirujano-odontologo': onlyPresencial,
  'ciencias-de-la-enfermeria': ['cuatrimestre', 'sabatino'],
  'protesis-dental': ['cuatrimestre', 'sabatino'],
  'nutricion-y-bienestar-integral': ['cuatrimestre', 'virtual', 'sabatino']
}

// Helper para enriquecer cada carrera con descripción y modalidades
const enrich = (career) => ({
  ...career,
  description: careerDescriptions[career.slug] || fallbackDescription,
  modalidades: modalidadesPorSlug[career.slug] || defaultModalidades
})

const rawAreas = [
  {
    id: 'empresariales',
    area: 'Ciencias Empresariales',
    icon: '💼',
    color: 'from-blue-500/30 to-cyan-500/20',
    description:
      'Para perfiles con interés en negocios, administración, turismo, finanzas, ventas, emprendimiento y gestión de servicios.',
    careers: [
      { name: 'Gastronomía y Gestión Turística', slug: 'gastronomia-y-gestion-turistica' },
      { name: 'Administración Empresarial', slug: 'administracion-empresarial' },
      { name: 'Contaduría Pública', slug: 'contaduria-publica' },
      { name: 'Hotelería y Turismo', slug: 'hoteleria-y-turismo' },
      { name: 'Mercadotecnia', slug: 'mercadotecnia' }
    ]
  },
  {
    id: 'juridicas',
    area: 'Ciencias Jurídicas y Sociales',
    icon: '⚖️',
    color: 'from-indigo-500/30 to-blue-500/20',
    description:
      'Para perfiles interesados en justicia, investigación, gobierno, relaciones internacionales, servicio público y análisis social.',
    careers: [
      { name: 'Criminología, Criminalística y Técnicas Periciales', slug: 'criminologia-criminalistica-y-tecnicas-periciales' },
      { name: 'Ciencias Políticas en Relaciones Internacionales', slug: 'ciencias-politicas-en-relaciones-internacionales' },
      { name: 'Ciencias Políticas en Administración Pública', slug: 'ciencias-politicas-en-administracion-publica' },
      { name: 'Derecho', slug: 'derecho' }
    ]
  },
  {
    id: 'educacion',
    area: 'Educación',
    icon: '📚',
    color: 'from-sky-500/30 to-blue-500/20',
    description:
      'Para perfiles con vocación de enseñanza, acompañamiento, inclusión, idiomas, deporte y desarrollo educativo.',
    careers: [
      { name: 'Educación Bilingüe', slug: 'educacion-bilinguee' },
      { name: 'Educación Especial', slug: 'educacion-especial' },
      { name: 'Actividad Física y Deporte', slug: 'actividad-fisica-y-deporte' }
    ]
  },
  {
    id: 'comunicacion',
    area: 'Ciencias de la Comunicación',
    icon: '📡',
    color: 'from-cyan-500/30 to-sky-500/20',
    description:
      'Para perfiles creativos y estratégicos interesados en medios, imagen pública, periodismo, publicidad y comunicación institucional.',
    careers: [
      { name: 'Relaciones Públicas e Imagen Corporativa', slug: 'relaciones-publicas-e-imagen-corporativa' },
      { name: 'Periodismo', slug: 'periodismo' },
      { name: 'Publicidad', slug: 'publicidad' }
    ]
  },
  {
    id: 'diseno',
    area: 'Diseño y Animación',
    icon: '🎨',
    color: 'from-fuchsia-500/30 to-blue-500/20',
    description:
      'Para perfiles visuales, creativos y tecnológicos interesados en arte digital, identidad gráfica, productos y comunicación visual.',
    careers: [
      { name: 'Animación y Arte Digital', slug: 'animacion-y-arte-digital' },
      { name: 'Diseño Industrial', slug: 'diseno-industrial' },
      { name: 'Diseño Gráfico', slug: 'diseno-grafico' }
    ]
  },
  {
    id: 'medicas',
    area: 'Ciencias Médicas',
    icon: '🩺',
    color: 'from-emerald-500/30 to-blue-500/20',
    description:
      'Para perfiles con vocación de servicio, salud, bienestar, atención clínica, nutrición, odontología, enfermería y psicología.',
    careers: [
      { name: 'Nutrición y Bienestar Integral', slug: 'nutricion-y-bienestar-integral' },
      { name: 'Médico Cirujano', slug: 'medico-cirujano' },
      { name: 'Prótesis Dental', slug: 'protesis-dental' },
      { name: 'Médico Cirujano Odontólogo', slug: 'medico-cirujano-odontologo' },
      { name: 'Ciencias de la Enfermería', slug: 'ciencias-de-la-enfermeria' },
      { name: 'Psicología Clínica', slug: 'psicologia-clinica' },
      { name: 'Psicología Educativa', slug: 'psicologia-educativa' }
    ]
  },
  {
    id: 'ingenieria',
    area: 'Ingeniería Superior',
    icon: '🛠️',
    color: 'from-amber-500/30 to-blue-500/20',
    description:
      'Para perfiles analíticos, técnicos y de solución de problemas interesados en sistemas, arquitectura, mecánica, electricidad, automotriz y geología.',
    careers: [
      { name: 'Arquitectura', slug: 'arquitectura' },
      { name: 'Ingeniero en Tecnologías y Sistemas de Información', slug: 'ingeniero-en-tecnologias-y-sistemas-de-informacion' },
      { name: 'Ingeniero Mecánico Administrador', slug: 'ingeniero-mecanico-administrador' },
      { name: 'Ingeniero Mecánico Electricista', slug: 'ingeniero-mecanico-electricista' },
      { name: 'Ingeniero Mecánico en Maquinaria Automotriz', slug: 'ingeniero-mecanico-en-maquinaria-automotriz' },
      { name: 'Ingeniero en Geología', slug: 'ingeniero-en-geologia' }
    ]
  }
]

export const unesCareerAreas = rawAreas.map((area) => ({
  ...area,
  careers: area.careers.map(enrich)
}))

// Índice plano (slug -> career enriquecida + area)
export const unesCareerIndex = unesCareerAreas.reduce((acc, area) => {
  area.careers.forEach((c) => {
    acc[c.slug] = {
      ...c,
      areaId: area.id,
      areaName: area.area,
      areaIcon: area.icon,
      areaColor: area.color
    }
  })
  return acc
}, {})

// Lookup helper
export const getCareerBySlug = (slug) => unesCareerIndex[slug] || null

// Maestrías agrupadas por área
export const unesMaestrias = [
  {
    area: 'Ciencias Médicas',
    items: [
      'Maestría en Ciencias de la Medicina Interna Familiar',
      'Maestría en Antienvejecimiento Estético y Nutrición',
      'Maestría en Ciencias Médicas, Epidemiología y Salud Pública',
      'Maestría en Liderazgo y Dirección de Instituciones de Salud',
      'Maestría en Enfermedades de la Familia, Crónicas y Degenerativas',
      'Maestría en Ciencias Clínicas de la Medicina'
    ]
  },
  {
    area: 'Educación y Psicología',
    items: [
      'Maestría en Educación Media y Universitaria',
      'Maestría en Psicología Laboral'
    ]
  },
  {
    area: 'Negocios y Derecho',
    items: [
      'Maestría en Materia Fiscal',
      'Maestría en Derecho Constitucional y Amparo',
      'Maestría en Comunicación Internacional'
    ]
  }
]

// Doctorados
export const unesDoctorados = [
  {
    area: 'Administración',
    items: ['Doctorado en Materia Fiscal']
  },
  {
    area: 'Educación',
    items: ['Doctorado en Ciencias de la Educación']
  },
  {
    area: 'Psicología',
    items: ['Doctorado en Psicología']
  }
]

// Fichas detalladas (perfil de ingreso/egreso adicionales)
export const unesCareerDetails = {
  'medico-cirujano': {
    duration: '9 semestres + 1 año de Internado + 1 año de Servicio Social',
    perfil:
      'Estabilidad emocional, vocación de servicio, actitud humanística, científica, espíritu creativo y crítico, capacidad de trabajo en equipo.',
    campo:
      'Instituciones de salud pública y privada, medicina de primer nivel, salud pública, investigación clínica.'
  }
}

export const unesCareerCount = unesCareerAreas.reduce(
  (total, area) => total + area.careers.length,
  0
)

export const unesMaestriasCount = unesMaestrias.reduce(
  (t, a) => t + a.items.length,
  0
)

export const unesDoctoradosCount = unesDoctorados.reduce(
  (t, a) => t + a.items.length,
  0
)
