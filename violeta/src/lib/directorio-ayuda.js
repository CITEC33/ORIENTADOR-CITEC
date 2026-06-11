import unipav from '../assets/imgs/unipav.png'
import dsmp from '../assets/imgs/logo_dmsp.png'

export const organizaciones = [
  {
    id: 'seguridad-publica',
    name: 'Dirección Municipal de Seguridad Pública',
    description:
      'Atención inmediata para situaciones de peligro inminente las 24 horas, los 365 días del año. Conexión directa con policía y servicios médicos.',
    phone: '6182844879',
    address: 'Carretera a México km 2.5, 34236 Durango, Dgo.',
    image: dsmp,
    hours: '24/7',
    URL: 'https://maps.app.goo.gl/K9PUnmMeNLo8s1Cu5',
    linae_abierta: true
  },
  {
    id: 'unipav',
    name: 'UNIPAV',
    description:
      'Atención de primer contacto para mujeres del municipio de Durango. Talleres de empoderamiento y asesoría.',
    phone: '6181324604',
    address: 'Calle Nezahualcóyotl 370, Fracc. Huizache II, Durango, Dgo.',
    image: unipav,
    hours: '8:00 a 20:00 horas',
    URL: 'https://maps.app.goo.gl/VEAFE3SngivmnRo78',
    linae_abierta: false
  }
]
