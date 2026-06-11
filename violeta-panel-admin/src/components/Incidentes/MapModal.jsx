import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Modal } from '../ui'
import {
  MapPin,
  ExternalLink,
  User,
  Navigation,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const getMarkerIcon = (status) => {
  const config = {
    active: { color: '#ef4444', shadow: 'rgba(239, 68, 68, 0.6)' },
    attended: { color: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.6)' },
    closed: { color: '#10b981', shadow: 'rgba(16, 185, 129, 0.6)' }
  }

  const { color, shadow } = config[status] || config.active

  const html = `
    <div style="position: relative; width: 24px; height: 24px;">
      ${
        status === 'active'
          ? `
        <div style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: ${color};
          border-radius: 50%;
          opacity: 0.7;
          animation: leaflet-pulse 1.5s infinite;
        "></div>
      `
          : ''
      }
      <div style="
        position: relative;
        background-color: ${color}; 
        width: 24px; height: 24px; 
        border-radius: 50%; 
        border: 3px solid #1f2937; /* Borde oscuro para el marcador */
        box-shadow: 0 4px 10px ${shadow};
      "></div>
    </div>
    <style>
      @keyframes leaflet-pulse {
        0% { transform: scale(1); opacity: 0.7; }
        70% { transform: scale(2.5); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
    </style>
  `

  return L.divIcon({
    html: html,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

export function MapModal({ isOpen, onClose, incident }) {
  if (!incident || !incident.latitud || !incident.longitud) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Ubicación no disponible'
        size='sm'
      >
        <div className='p-8 text-center flex flex-col items-center gap-4'>
          <div className='w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700'>
            <MapPin className='w-8 h-8 text-gray-500' />
          </div>
          <p className='text-gray-400 font-medium'>
            No se registraron coordenadas GPS para este incidente.
          </p>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-800 rounded-lg text-sm font-bold text-gray-300 hover:bg-gray-700'
          >
            Cerrar
          </button>
        </div>
      </Modal>
    )
  }

  const lat = parseFloat(incident.latitud)
  const lng = parseFloat(incident.longitud)
  const position = [lat, lng]
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleMapsUrl)
    toast.success('URL del mapa copiada', {
      description: `${lat}, ${lng}`,
      icon: <Check className='w-4 h-4 text-emerald-500' />
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className='flex items-center gap-2'>
          <MapPin className='w-5 h-5 text-purple-500' />
          <span>Geolocalización del Incidente</span>
        </div>
      }
      size='xl'
    >
      <div className='flex flex-col gap-6'>
        <div className='relative w-full h-[430px] rounded-3xl overflow-hidden border-2 border-gray-700 shadow-xl group'>
          <MapContainer
            center={position}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            />
            <Marker position={position} icon={getMarkerIcon(incident.status)}>
              <Popup className='custom-popup'>
                <div className='p-1 text-center text-gray-900'>
                  <span className='font-bold block mb-1'>Punto de Alerta</span>
                  <span className='text-xs text-gray-600'>
                    Precisión: ±{Math.round(incident.precision_gps || 0)}m
                  </span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {incident.precision_gps > 50 && (
            <div className='absolute top-4 right-4 z-[400] bg-gray-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-amber-500/50 shadow-lg flex items-center gap-2 text-xs font-bold text-amber-500'>
              <AlertTriangle size={14} />
              Señal GPS débil (±{Math.round(incident.precision_gps)}m)
            </div>
          )}

          <div className='absolute bottom-1 sm:bottom-4 left-1/2 -translate-x-1/2 z-[9999999] sm:z-[400]'>
            <Link
              to={googleMapsUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-lg shadow-purple-900/50 transition-transform hover:scale-105 active:scale-95'
            >
              <MapPin size={16} className='shrink-0' />
              <span className='hidden sm:inline'>Abrir navegación externa</span>
              <span className='sm:hidden'>Abrir</span>
              <ExternalLink size={16} className='opacity-70 ml-1 shrink-0' />
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center border border-gray-600 text-purple-500 shadow-sm shrink-0'>
              {incident?.usuarias?.foto ? (
                <img
                  src={incident.usuarias.foto}
                  alt='Foto de usuaria'
                  className='w-full h-full object-cover rounded-full'
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                Usuaria
              </p>
              <p className='font-bold text-white'>
                {incident.usuarias.nombre_completo}
                {incident.usuarias?.apellido_p}
                {incident.usuarias?.apellido_m}
              </p>
            </div>
          </div>

          <div className='bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-600 text-blue-500 shadow-sm shrink-0'>
                <Navigation size={20} />
              </div>
              <div>
                <p className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                  Coordenadas
                </p>
                <p className='font-mono text-sm font-bold text-white'>
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className='p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white'
              title='Copiar Lat/Long'
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-xs text-gray-500'>
            La ubicación mostrada corresponde al momento exacto en que se detonó
            la alerta.
          </p>
        </div>
      </div>
    </Modal>
  )
}
