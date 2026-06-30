export const unesCareerAreas = [
  {
    area: 'Ciencias Empresariales',
    description:
      'Area para perfiles con interes en negocios, administracion, turismo, finanzas, ventas, emprendimiento y gestion de servicios.',
    careers: [
      'Gastronomia y Gestion Turistica',
      'Administracion Empresarial',
      'Contaduria Publica',
      'Hoteleria y Turismo',
      'Mercadotecnia'
    ]
  },
  {
    area: 'Ciencias Juridicas y Sociales',
    description:
      'Area para perfiles interesados en justicia, investigacion, gobierno, relaciones internacionales, servicio publico y analisis social.',
    careers: [
      'Criminologia, Criminalistica y Tecnicas Periciales',
      'Ciencias Politicas en Relaciones Internacionales',
      'Ciencias Politicas en Administracion Publica',
      'Derecho'
    ]
  },
  {
    area: 'Educacion',
    description:
      'Area para perfiles con vocacion de ensenanza, acompanamiento, inclusion, idiomas, deporte y desarrollo educativo.',
    careers: [
      'Educacion Bilingue',
      'Educacion Especial',
      'Actividad Fisica y Deporte'
    ]
  },
  {
    area: 'Ciencias de la Comunicacion',
    description:
      'Area para perfiles creativos y estrategicos interesados en medios, imagen publica, periodismo, publicidad y comunicacion institucional.',
    careers: [
      'Relaciones Publicas e Imagen Corporativa',
      'Periodismo',
      'Publicidad'
    ]
  },
  {
    area: 'Diseno y Animacion',
    description:
      'Area para perfiles visuales, creativos y tecnologicos interesados en arte digital, identidad grafica, productos y comunicacion visual.',
    careers: [
      'Animacion y Arte Digital',
      'Diseno Industrial',
      'Diseno Grafico'
    ]
  },
  {
    area: 'Ciencias Medicas',
    description:
      'Area para perfiles con vocacion de servicio, salud, bienestar, atencion clinica, nutricion, odontologia, enfermeria y psicologia.',
    careers: [
      'Nutricion y Bienestar Integral',
      'Medico Cirujano',
      'Protesis Dental',
      'Medico Cirujano Odontologo',
      'Ciencias de la Enfermeria',
      'Psicologia Clinica',
      'Psicologia Educativa'
    ]
  },
  {
    area: 'Ingenieria Superior',
    description:
      'Area para perfiles analiticos, tecnicos y de solucion de problemas interesados en sistemas, arquitectura, mecanica, electricidad, automotriz y geologia.',
    careers: [
      'Arquitectura',
      'Ingeniero en Tecnologias y Sistemas de Informacion',
      'Ingeniero Mecanico Administrador',
      'Ingeniero Mecanico Electricista',
      'Ingeniero Mecanico en Maquinaria Automotriz',
      'Ingeniero en Geologia'
    ]
  }
]

export const unesCareerCount = unesCareerAreas.reduce(
  (total, area) => total + area.careers.length,
  0
)
