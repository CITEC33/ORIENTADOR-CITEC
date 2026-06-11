import { supabase } from './supabase'

// Subir imagen y retornar URL pública
export const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('articulos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('articulos').getPublicUrl(filePath)
  return data.publicUrl
}
