import { supabase } from './supabase'

// Eliminar imagen anterior del Bucket
export const deleteImageFromStorage = async (fullUrl) => {
  if (!fullUrl) return

  // Extraemos el path del archivo de la URL completa
  // Ejemplo URL: .../storage/v1/object/public/articulos/123456.jpg
  // Necesitamos solo: 123456.jpg
  const path = fullUrl.split('/articulos/').pop()

  if (path) {
    const { error } = await supabase.storage.from('articulos').remove([path])

    if (error) console.error('Error eliminando imagen vieja:', error)
  }
}
