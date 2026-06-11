export const VIOLENCE_TYPES_INFO = [
  {
    id: 'psychological',
    title: 'Violencia Psicológica y Emocional',
    icon: 'Brain',
    definition:
      'Cualquier acto u omisión que dañe la estabilidad psicológica. Incluye negligencia, abandono, descuido reiterado, celotipia, insultos, humillaciones, devaluación, marginación, indiferencia, comparaciones destructivas y amenazas.',
    examples: [
      "Te aplica la 'ley del hielo' (te ignora) por días.",
      'Te dice que estás loca o que inventas cosas (Gaslighting).',
      'Te humilla frente a amigos o familiares.',
      'Amenaza con irse o con hacerse daño si no haces lo que quiere.'
    ],
    signs: [
      'Baja autoestima',
      'Miedo a expresarte',
      'Sensación de culpa constante',
      'Aislamiento social'
    ],
    impact:
      'Depresión, ansiedad, indefensión aprendida y trastorno de estrés postraumático.'
  },
  {
    id: 'economic',
    title: 'Violencia Económica',
    icon: 'DollarSign',
    definition:
      'Acción u omisión del agresor que afecta la supervivencia económica de la víctima. Se manifiesta a través de limitaciones, control o percepción de un salario menor por igual trabajo.',
    examples: [
      'Te prohíbe trabajar o estudiar.',
      'Te pide tickets de cada peso que gastas.',
      'Se niega a aportar dinero para necesidades básicas del hogar.',
      'Te quita tu dinero o tarjetas.'
    ],
    signs: [
      'Dependencia financiera total',
      "Tener que 'rogar' por dinero",
      'Desconocimiento de los ingresos familiares'
    ],
    impact:
      'Pérdida de autonomía, inseguridad sobre el futuro y dificultad para salir del ciclo de violencia.'
  },
  {
    id: 'digital',
    title: 'Violencia Digital',
    icon: 'Wifi',
    definition:
      'Actos de acoso, hostigamiento, amenazas, insultos, vulneración de datos e información privada, divulgación de contenido sexual sin consentimiento (Ley Olimpia) a través de tecnologías de la información.',
    examples: [
      'Te exige tus contraseñas de redes sociales.',
      'Te monitorea con GPS en todo momento.',
      'Amenaza con publicar fotos íntimas tuyas.',
      'Te acosa con mensajes constantes si no respondes rápido.'
    ],
    signs: [
      'Ansiedad al recibir notificaciones',
      'Miedo a usar el celular',
      'Autocensura en redes'
    ],
    impact:
      'Aislamiento digital, daño a la reputación, ansiedad social y paranoia.'
  },
  {
    id: 'physical',
    title: 'Violencia Física',
    icon: 'Hand',
    definition:
      'Cualquier acto que inflige daño no accidental, usando la fuerza física o algún tipo de arma u objeto que pueda provocar o no lesiones ya sean internas, externas, o ambas.',
    examples: [
      "Empujones, jalones de cabello o 'zapes'.",
      'Te lanza objetos cuando se enoja.',
      'Te aprieta fuerte los brazos.',
      'Golpes, patadas o inmovilización.'
    ],
    signs: [
      'Moretones inexplicables',
      'Uso de ropa para cubrir el cuerpo excesivamente',
      'Sobresalto ante movimientos bruscos'
    ],
    impact:
      'Lesiones temporales o permanentes, discapacidad, y en casos extremos, feminicidio.'
  },
  {
    id: 'sexual',
    title: 'Violencia Sexual',
    icon: 'Heart',
    definition:
      'Cualquier acto que degrada o daña el cuerpo y/o la sexualidad de la víctima y que por tanto atenta contra su libertad, dignidad e integridad física. Es una expresión de abuso de poder.',
    examples: [
      'Te obliga a tener relaciones cuando no quieres.',
      'Se niega a usar condón o manipula tus anticonceptivos.',
      'Te toca sin tu consentimiento.',
      'Te obliga a realizar prácticas sexuales que te incomodan.'
    ],
    signs: [
      'Dolor físico crónico',
      'Infecciones recurrentes',
      'Rechazo al contacto físico'
    ],
    impact:
      'Trauma sexual, embarazos no deseados, ITS, disociación y profundo daño emocional.'
  }
]

export const TEST_VIOLENTOMETRO_META = {
  title: 'TEST VIOLENTÓMETRO',
  subtitle: 'Herramienta de Reflexión y Canalización',
  disclaimer:
    'Este instrumento es confidencial y tiene fines preventivos. No sustituye una evaluación profesional.',
  dangerTitle: '⚠️ En caso de peligro inmediato',
  contacts: {
    unipavLabel: '📞 UNIPAV',
    unipav: '618 132 4604',
    dmspLabel: '📞 Dirección Municipal de Seguridad Pública',
    dmsp: '618 284 4879'
  },
  instructionsTitle: 'Instrucciones',
  instructionsText:
    'Marca la opción que mejor describa tu situación en los últimos 6 meses:',
  scale: [
    { label: 'Nunca', value: 0 },
    { label: 'A veces', value: 1 },
    { label: 'Frecuente', value: 2 },
    { label: 'Siempre', value: 3 }
  ]
}

export const VIOLENCE_LEVELS = [
  {
    id: 1,
    emoji: '🟡',
    name: 'Señales de Alerta',
    description: 'Violencia Psicológica'
  },
  {
    id: 2,
    emoji: '🟠',
    name: 'Violencia en Escalada',
    description: 'Riesgo Moderado'
  },
  {
    id: 3,
    emoji: '🔴',
    name: 'Violencia Grave',
    description: 'Alto Riesgo'
  }
]

const SCALE_OPTIONS = ['Nunca', 'A veces', 'Frecuente', 'Siempre']

export const VIOLENTOMETRO_QUESTIONS = [
  // 🟡 Nivel 1
  {
    id: 'q1',
    level: 1,
    text: '¿Tu pareja se molesta cuando convives con otras personas?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q2',
    level: 1,
    text: '¿Revisa tu celular o redes sociales sin tu permiso?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q3',
    level: 1,
    text: '¿Hace comentarios que te hacen sentir menos o insuficiente?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q4',
    level: 1,
    text: "¿Te aplica la 'ley del hielo' como forma de castigo?",
    options: SCALE_OPTIONS
  },
  {
    id: 'q5',
    level: 1,
    text: '¿Te culpa constantemente de los problemas de la relación?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q6',
    level: 1,
    text: '¿Te manipula diciendo que sin él/ella no vales o no puedes sola/o?',
    options: SCALE_OPTIONS
  },

  // 🟠 Nivel 2
  {
    id: 'q7',
    level: 2,
    text: '¿Te ha gritado o humillado frente a otras personas?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q8',
    level: 2,
    text: '¿Te amenaza con terminar o hacerte daño si no obedeces?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q9',
    level: 2,
    text: '¿Controla tu dinero o limita tus recursos económicos?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q10',
    level: 2,
    text: '¿Te impide ver a familiares o amistades?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q11',
    level: 2,
    text: '¿Ha roto objetos o golpeado paredes durante discusiones?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q12',
    level: 2,
    text: '¿Te ha empujado, jaloneado o sujetado con fuerza?',
    options: SCALE_OPTIONS
  },

  // 🔴 Nivel 3
  {
    id: 'q13',
    level: 3,
    text: '¿Te ha golpeado o agredido físicamente?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q14',
    level: 3,
    text: '¿Te ha obligado a tener relaciones sexuales sin tu consentimiento?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q15',
    level: 3,
    text: '¿Te ha amenazado con un arma o con quitarte la vida?',
    options: SCALE_OPTIONS
  },
  {
    id: 'q16',
    level: 3,
    text: '¿Has sentido miedo real por tu vida o tu seguridad?',
    options: SCALE_OPTIONS
  }
]

const ANSWER_POINTS = {
  Nunca: 0,
  'A veces': 1,
  Frecuente: 2,
  Siempre: 3
}

export const RESULTS_DATA = {
  BAJO: {
    emoji: '🟢',
    title: 'Mantente alerta',
    description: 'No hay indicadores graves actuales, pero mantente alerta.'
  },
  PSICOLOGICA: {
    emoji: '🟡',
    title: 'Existe violencia psicológica',
    description: 'Existe violencia psicológica. La violencia nunca es normal.'
  },
  MODERADO: {
    emoji: '🟠',
    title: 'Riesgo moderado',
    description: 'Hay riesgo moderado. La situación puede escalar.'
  },
  ALTO: {
    emoji: '🔴',
    title: 'Riesgo alto',
    description: 'Riesgo alto. Tu seguridad puede estar en peligro.'
  }
}

export const CONSCIENCE_MESSAGE = {
  title: 'Mensaje de Conciencia y Denuncia',
  lines: [
    'La violencia nunca es tu culpa.',
    'No estás exagerando.',
    'No estás sola.',
    'Denunciar es un acto de valentía y amor propio.',
    'Pedir ayuda puede salvar tu vida.'
  ]
}

export const calculateRisk = (answers) => {
  let totalScore = 0
  let immediateHelp = false

  const levelScores = { 1: 0, 2: 0, 3: 0 }

  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = VIOLENTOMETRO_QUESTIONS.find((q) => q.id === questionId)
    if (!question) return

    const points = ANSWER_POINTS[answer] ?? 0
    totalScore += points

    levelScores[question.level] += points

    if (question.level === 3 && answer === 'Siempre') {
      immediateHelp = true
    }
  })

  let bandKey = 'BAJO'
  let color = 'green'

  if (totalScore >= 9 && totalScore <= 16) {
    bandKey = 'PSICOLOGICA'
    color = 'yellow'
  } else if (totalScore >= 17 && totalScore <= 28) {
    bandKey = 'MODERADO'
    color = 'orange'
  } else if (totalScore >= 29) {
    bandKey = 'ALTO'
    color = 'red'
  }

  if (immediateHelp) {
    bandKey = 'ALTO'
    color = 'red'
  }

  return {
    bandKey,
    color,
    totalScore,
    maxScore: VIOLENTOMETRO_QUESTIONS.length * 3,
    immediateHelp,
    levelScores
  }
}
