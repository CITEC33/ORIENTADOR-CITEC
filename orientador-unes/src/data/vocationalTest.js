// ---------------------------------------------------------------------------
// Test vocacional UNES Orienta IA — adaptado del test CHASIDE
// ---------------------------------------------------------------------------
// CHASIDE (Chávez Guerrero, 1998) es un test vocacional muy usado en México:
//   C: Ciencias Administrativas y Contables
//   H: Humanidades y Ciencias Sociales
//   A: Artísticas
//   S: Salud y Ciencias Médicas
//   I: Ingeniería y Computación
//   D: Defensa y Seguridad (Justicia, Derecho, Criminología)
//   E: Ciencias Exactas y Educativas (mapeado a educación por oferta UNES)
//
// Mapeo a las áreas ya usadas en la app + solo carreras UNES:
//   C → empresariales
//   H → comunicacion
//   A → diseno
//   S → medicas
//   I → ingenieria
//   D → juridicas
//   E → educacion
//
// 12 preguntas, 4 opciones cada una, cada opción suma a 1-2 áreas.
// Al final devolvemos las 3 áreas ganadoras y las carreras UNES sugeridas.
// ---------------------------------------------------------------------------

export const AREA_META = {
  empresariales: {
    label: 'Negocios y Empresas',
    icon: '💼',
    color: 'from-blue-500 to-cyan-500',
    summary:
      'Te motivan los retos, los negocios, liderar equipos y crear valor en organizaciones.'
  },
  juridicas: {
    label: 'Justicia y Sociedad',
    icon: '⚖️',
    color: 'from-indigo-500 to-blue-500',
    summary:
      'Buscas justicia, orden social, investigación y servicio a las personas y al Estado.'
  },
  educacion: {
    label: 'Educación y Desarrollo Humano',
    icon: '📚',
    color: 'from-sky-500 to-blue-500',
    summary:
      'Te encanta enseñar, acompañar y formar a otras personas para su crecimiento integral.'
  },
  comunicacion: {
    label: 'Comunicación y Medios',
    icon: '📡',
    color: 'from-cyan-500 to-sky-500',
    summary:
      'Te apasiona contar historias, conectar audiencias, crear contenido y manejar imagen pública.'
  },
  diseno: {
    label: 'Arte, Diseño y Creatividad',
    icon: '🎨',
    color: 'from-fuchsia-500 to-blue-500',
    summary:
      'Vives de las ideas visuales, la estética, la creatividad y la expresión gráfica o digital.'
  },
  medicas: {
    label: 'Salud y Ciencias Médicas',
    icon: '🩺',
    color: 'from-emerald-500 to-blue-500',
    summary:
      'Tienes vocación de servicio, te interesa la salud, las ciencias biológicas y el bienestar humano.'
  },
  ingenieria: {
    label: 'Ingeniería y Tecnología',
    icon: '🛠️',
    color: 'from-amber-500 to-blue-500',
    summary:
      'Disfrutas resolver problemas, diseñar sistemas, construir cosas y trabajar con tecnología.'
  }
}

/**
 * 12 preguntas basadas en dimensiones CHASIDE.
 * Cada opción tiene: text, emoji, scores: { area: puntos }
 */
export const vocationalQuestions = [
  // ---- 1. Intereses en tiempo libre (dimensión general CHASIDE) ----
  {
    id: 'q1',
    aquila: 'En tu tiempo libre, ¿qué disfrutas más?',
    options: [
      { text: 'Organizar planes, presupuestos o pequeños emprendimientos', emoji: '📊', scores: { empresariales: 2 } },
      { text: 'Leer noticias, opinar sobre política o problemas sociales', emoji: '📰', scores: { juridicas: 1, comunicacion: 1 } },
      { text: 'Dibujar, editar fotos o hacer contenido creativo', emoji: '🎨', scores: { diseno: 2 } },
      { text: 'Cuidar a alguien, hacer ejercicio o aprender de salud', emoji: '🩺', scores: { medicas: 2 } }
    ]
  },
  // ---- 2. Materia favorita en la prepa (I / E) ----
  {
    id: 'q2',
    aquila: '¿Cuál materia se te da mejor?',
    options: [
      { text: 'Matemáticas y física', emoji: '📐', scores: { ingenieria: 2 } },
      { text: 'Biología, química o anatomía', emoji: '🧬', scores: { medicas: 2 } },
      { text: 'Historia, filosofía o civismo', emoji: '📜', scores: { juridicas: 1, educacion: 1 } },
      { text: 'Español, literatura o inglés', emoji: '🗣️', scores: { comunicacion: 1, educacion: 1 } }
    ]
  },
  // ---- 3. ¿Qué te motiva en un trabajo? (dimensión motivación) ----
  {
    id: 'q3',
    aquila: '¿Qué te motiva más en un trabajo?',
    options: [
      { text: 'Ganar bien y liderar equipos', emoji: '💼', scores: { empresariales: 2 } },
      { text: 'Ayudar y cuidar a las personas', emoji: '🤝', scores: { medicas: 1, educacion: 1 } },
      { text: 'Investigar la verdad y aplicar justicia', emoji: '⚖️', scores: { juridicas: 2 } },
      { text: 'Crear cosas nuevas con creatividad', emoji: '✨', scores: { diseno: 1, comunicacion: 1 } }
    ]
  },
  // ---- 4. Tipo de tareas que se te dan (CHASIDE clasificatorio) ----
  {
    id: 'q4',
    aquila: '¿Con qué tipo de tarea te sientes cómodo?',
    options: [
      { text: 'Armar, reparar o programar cosas', emoji: '🛠️', scores: { ingenieria: 2 } },
      { text: 'Explicar temas a un grupo', emoji: '🧑‍🏫', scores: { educacion: 2 } },
      { text: 'Escribir textos claros y persuasivos', emoji: '✍️', scores: { comunicacion: 1, juridicas: 1 } },
      { text: 'Diseñar algo visual desde cero', emoji: '🖼️', scores: { diseno: 2 } }
    ]
  },
  // ---- 5. Preferencia de ambiente laboral ----
  {
    id: 'q5',
    aquila: '¿Dónde te ves trabajando?',
    options: [
      { text: 'En una oficina corporativa o mi propia empresa', emoji: '🏢', scores: { empresariales: 2 } },
      { text: 'En un hospital, clínica o consultorio', emoji: '🏥', scores: { medicas: 2 } },
      { text: 'En una agencia de medios, TV o marketing', emoji: '📺', scores: { comunicacion: 2 } },
      { text: 'En un estudio de diseño o animación', emoji: '💻', scores: { diseno: 2 } }
    ]
  },
  // ---- 6. Situaciones que no soportarías (aversión) ----
  {
    id: 'q6',
    aquila: '¿Qué NO soportarías hacer todos los días?',
    options: [
      { text: 'Números, contabilidad o ventas', emoji: '🧾', scores: { diseno: 1, comunicacion: 1 } },
      { text: 'Sangre, pacientes o cirugías', emoji: '💉', scores: { empresariales: 1, ingenieria: 1 } },
      { text: 'Discutir leyes o argumentar frente a un juez', emoji: '👨‍⚖️', scores: { diseno: 1, medicas: 1 } },
      { text: 'Programar código o resolver fórmulas', emoji: '🧮', scores: { comunicacion: 1, educacion: 1 } }
    ]
  },
  // ---- 7. Habilidades personales (autopercepción) ----
  {
    id: 'q7',
    aquila: '¿En qué eres bueno según tus amigos?',
    options: [
      { text: 'Negociar y convencer', emoji: '🤝', scores: { empresariales: 1, juridicas: 1 } },
      { text: 'Escuchar y dar consejo', emoji: '👂', scores: { educacion: 1, medicas: 1 } },
      { text: 'Contar historias o hacer reír', emoji: '🎤', scores: { comunicacion: 2 } },
      { text: 'Resolver problemas técnicos', emoji: '⚙️', scores: { ingenieria: 2 } }
    ]
  },
  // ---- 8. Interés por temas específicos (afinidad temática) ----
  {
    id: 'q8',
    aquila: '¿Qué tema te da curiosidad genuina?',
    options: [
      { text: 'Cómo funcionan las empresas y el dinero', emoji: '💰', scores: { empresariales: 2 } },
      { text: 'Cómo funciona el cuerpo humano', emoji: '🫀', scores: { medicas: 2 } },
      { text: 'Cómo se investiga un delito', emoji: '🔍', scores: { juridicas: 2 } },
      { text: 'Cómo se construye una app o un puente', emoji: '🌉', scores: { ingenieria: 2 } }
    ]
  },
  // ---- 9. Preferencia de estudio ----
  {
    id: 'q9',
    aquila: '¿Cómo prefieres estudiar?',
    options: [
      { text: 'Con casos reales y práctica en aula', emoji: '📚', scores: { juridicas: 1, empresariales: 1 } },
      { text: 'Con proyectos creativos y visuales', emoji: '🎨', scores: { diseno: 1, comunicacion: 1 } },
      { text: 'En laboratorio con experimentos', emoji: '🧪', scores: { medicas: 1, ingenieria: 1 } },
      { text: 'Interactuando con niños o jóvenes', emoji: '👦', scores: { educacion: 2 } }
    ]
  },
  // ---- 10. Personalidad social vs. analítica ----
  {
    id: 'q10',
    aquila: '¿Cómo te describirías?',
    options: [
      { text: 'Sociable y persuasivo', emoji: '💬', scores: { comunicacion: 1, empresariales: 1 } },
      { text: 'Analítico y observador', emoji: '🔬', scores: { juridicas: 1, medicas: 1 } },
      { text: 'Creativo y sensible', emoji: '🌈', scores: { diseno: 2 } },
      { text: 'Metódico y práctico', emoji: '📏', scores: { ingenieria: 1, educacion: 1 } }
    ]
  },
  // ---- 11. Objeto/herramienta favorita ----
  {
    id: 'q11',
    aquila: '¿Cuál de estas herramientas usarías todo el día?',
    options: [
      { text: 'Excel, agenda y calculadora', emoji: '📊', scores: { empresariales: 2 } },
      { text: 'Estetoscopio, microscopio o bata', emoji: '🩺', scores: { medicas: 2 } },
      { text: 'Tableta gráfica y cámara', emoji: '📷', scores: { diseno: 1, comunicacion: 1 } },
      { text: 'Laptop, código y multímetro', emoji: '💻', scores: { ingenieria: 2 } }
    ]
  },
  // ---- 12. Meta profesional / propósito ----
  {
    id: 'q12',
    aquila: '¿Cuál sería tu MEJOR logro en 10 años?',
    options: [
      { text: 'Tener mi propia empresa exitosa', emoji: '🏆', scores: { empresariales: 2 } },
      { text: 'Salvar vidas y cuidar la salud pública', emoji: '❤️', scores: { medicas: 2 } },
      { text: 'Formar una nueva generación de estudiantes', emoji: '🎓', scores: { educacion: 2 } },
      { text: 'Defender causas justas o resolver casos', emoji: '⚖️', scores: { juridicas: 2 } }
    ]
  }
]

// ---------------------------------------------------------------------------
// Carreras UNES agrupadas por área (SOLO UNES Durango, sin externos).
// Los `slug` coinciden con los de unesCareers.js para permitir enlazar.
// ---------------------------------------------------------------------------
export const careersByArea = {
  empresariales: [
    { nombre: 'Administración Empresarial', slug: 'administracion-empresarial' },
    { nombre: 'Contaduría Pública', slug: 'contaduria-publica' },
    { nombre: 'Mercadotecnia', slug: 'mercadotecnia' },
    { nombre: 'Hotelería y Turismo', slug: 'hoteleria-y-turismo' },
    { nombre: 'Gastronomía y Gestión Turística', slug: 'gastronomia-y-gestion-turistica' }
  ],
  juridicas: [
    { nombre: 'Derecho', slug: 'derecho' },
    { nombre: 'Criminología, Criminalística y Técnicas Periciales', slug: 'criminologia-criminalistica-y-tecnicas-periciales' },
    { nombre: 'Ciencias Políticas en Administración Pública', slug: 'ciencias-politicas-en-administracion-publica' },
    { nombre: 'Ciencias Políticas en Relaciones Internacionales', slug: 'ciencias-politicas-en-relaciones-internacionales' }
  ],
  educacion: [
    { nombre: 'Educación Bilingüe', slug: 'educacion-bilinguee' },
    { nombre: 'Educación Especial', slug: 'educacion-especial' },
    { nombre: 'Actividad Física y Deporte', slug: 'actividad-fisica-y-deporte' }
  ],
  comunicacion: [
    { nombre: 'Relaciones Públicas e Imagen Corporativa', slug: 'relaciones-publicas-e-imagen-corporativa' },
    { nombre: 'Periodismo', slug: 'periodismo' },
    { nombre: 'Publicidad', slug: 'publicidad' }
  ],
  diseno: [
    { nombre: 'Diseño Gráfico', slug: 'diseno-grafico' },
    { nombre: 'Animación y Arte Digital', slug: 'animacion-y-arte-digital' },
    { nombre: 'Diseño Industrial', slug: 'diseno-industrial' }
  ],
  medicas: [
    { nombre: 'Médico Cirujano', slug: 'medico-cirujano' },
    { nombre: 'Médico Cirujano Odontólogo', slug: 'medico-cirujano-odontologo' },
    { nombre: 'Nutrición y Bienestar Integral', slug: 'nutricion-y-bienestar-integral' },
    { nombre: 'Prótesis Dental', slug: 'protesis-dental' }
  ],
  ingenieria: [
    { nombre: 'Ingeniería en Sistemas Computacionales', slug: 'ingenieria-en-sistemas-computacionales' },
    { nombre: 'Ingeniería Industrial', slug: 'ingenieria-industrial' },
    { nombre: 'Ingeniería Civil', slug: 'ingenieria-civil' },
    { nombre: 'Arquitectura', slug: 'arquitectura' }
  ]
}

// ---------------------------------------------------------------------------
// Frases de ánimo que dice Aquila entre pregunta y pregunta
// ---------------------------------------------------------------------------
export const aquilaCheers = [
  '¡Vamos bien! 🦅 Cada respuesta me dice más de ti.',
  '¡Excelente! Sigue así, esto ya toma forma.',
  'Interesante… déjame procesar esto.',
  '¡Estás en racha! Vamos por la siguiente.',
  'Cada respuesta cuenta, no hay opciones malas.',
  '¡Confío en tu instinto! Elige con honestidad.',
  '¡Yo lo veo claro! Sigamos.',
  '¡Wow, vas encaminado! No pares.',
  'Muy interesante lo que me estás contando.',
  'Ya casi terminamos, aguanta el vuelo. 🪶',
  'Última recta, ¡no te sueltes!',
  '¡Perfecto! Con esto arma tu perfil.'
]

// Compatibilidad hacia atrás (código legacy lo importa como quilaCheers)
export const quilaCheers = aquilaCheers

// ---------------------------------------------------------------------------
// Función de cálculo de resultado
// ---------------------------------------------------------------------------

/**
 * @param {Record<string, number>} answers  { qId: optionIndex, … }
 * @returns { total, byArea, topAreas: [{area, score, meta}], recommendations }
 */
export function computeVocationalResult(answers) {
  const byArea = Object.fromEntries(Object.keys(AREA_META).map((k) => [k, 0]))

  vocationalQuestions.forEach((q) => {
    const optIdx = answers[q.id]
    if (optIdx === undefined || optIdx === null) return
    const opt = q.options[optIdx]
    if (!opt) return
    Object.entries(opt.scores).forEach(([area, pts]) => {
      byArea[area] = (byArea[area] || 0) + pts
    })
  })

  const totalPoints = Object.values(byArea).reduce((a, b) => a + b, 0) || 1

  const topAreas = Object.entries(byArea)
    .map(([area, score]) => ({
      area,
      score,
      pct: Math.round((score / totalPoints) * 100),
      meta: AREA_META[area]
    }))
    .sort((a, b) => b.score - a.score)

  // Si empate en 3ra posición, incluimos el empate.
  const topThree = topAreas.slice(0, 3)

  const recommendations = topThree.flatMap((a) => careersByArea[a.area] || [])

  return {
    total: totalPoints,
    byArea,
    topAreas: topThree,
    allAreas: topAreas,
    recommendations
  }
}
