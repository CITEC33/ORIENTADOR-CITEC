export const unesCareerAreas = [
  {
    area: 'Ciencias Empresariales',
    description:
      'Para perfiles con interés en negocios, administración, turismo, ventas, finanzas, emprendimiento, organización y gestión de servicios.',
    careers: [
      'Gastronomía y Gestión Turística',
      'Administración Empresarial',
      'Contaduría Pública',
      'Hotelería y Turismo',
      'Mercadotecnia'
    ]
  },
  {
    area: 'Ciencias Jurídicas y Sociales',
    description:
      'Para perfiles interesados en justicia, seguridad, investigación, gobierno, relaciones internacionales, servicio público y análisis social.',
    careers: [
      'Criminología, Criminalística y Técnicas Periciales',
      'Ciencias Políticas en Relaciones Internacionales',
      'Ciencias Políticas en Administración Pública',
      'Derecho'
    ]
  },
  {
    area: 'Educación',
    description:
      'Para perfiles con vocación de enseñanza, acompañamiento, inclusión, idiomas, deporte, formación humana y desarrollo educativo.',
    careers: [
      'Educación Bilingüe',
      'Educación Especial',
      'Actividad Física y Deporte'
    ]
  },
  {
    area: 'Ciencias de la Comunicación',
    description:
      'Para perfiles creativos, expresivos y estratégicos, interesados en medios, imagen pública, periodismo, publicidad y comunicación institucional.',
    careers: [
      'Relaciones Públicas e Imagen Corporativa',
      'Periodismo',
      'Publicidad'
    ]
  },
  {
    area: 'Diseño y Animación',
    description:
      'Para perfiles visuales, creativos y tecnológicos, interesados en arte digital, identidad gráfica, productos, animación y comunicación visual.',
    careers: ['Animación y Arte digital', 'Diseño Industrial', 'Diseño Gráfico']
  },
  {
    area: 'Ciencias Médicas',
    description:
      'Para perfiles con vocación de servicio, salud, bienestar, atención clínica, nutrición, odontología, enfermería y psicología.',
    careers: [
      'Nutrición y Bienestar Integral',
      'Médico Cirujano',
      'Prótesis dental',
      'Médico Cirujano Odontólogo',
      'Ciencias de la Enfermería',
      'Psicología Clínica',
      'Psicología Educativa'
    ]
  },
  {
    area: 'Ingeniería Superior',
    description:
      'Para perfiles analíticos, técnicos y de solución de problemas, interesados en sistemas, arquitectura, mecánica, electricidad, automotriz y geología.',
    careers: [
      'Arquitectura',
      'Ingeniero en Tecnologías y Sistemas de Información',
      'Ingeniero Mecánico Administrador',
      'Ingeniero Mecánico Electricista',
      'Ingeniero Mecánico en Maquinaria Automotriz',
      'Ingeniero en Geología'
    ]
  }
]

export const unesCareerCount = unesCareerAreas.reduce(
  (total, area) => total + area.careers.length,
  0
)
