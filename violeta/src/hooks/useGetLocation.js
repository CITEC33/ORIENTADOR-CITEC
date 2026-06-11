import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'

export const useGetLocation = () => {
  const getFullLocation = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const permissionStatus = await Geolocation.checkPermissions()

        if (permissionStatus.location !== 'granted') {
          const request = await Geolocation.requestPermissions()
          if (request.location !== 'granted') {
            throw new Error('Permiso de ubicación denegado por el usuario.')
          }
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      })

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      }

      localStorage.setItem('ubicacion_actual', JSON.stringify(locationData))

      return locationData
    } catch (error) {
      console.error('Error obteniendo ubicación')
      throw error
    }
  }

  return { getFullLocation }
}
