import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { uploadImage } from '../lib/uploadImage'
import { deleteImageFromStorage } from '../lib/deleteImageFromStorage'

export function useArticulos() {
  const queryClient = useQueryClient()

  // 1. Obtener Artículos
  const query = useQuery({
    queryKey: ['articulos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articulos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  // 2. Crear Artículo
  const createMutation = useMutation({
    mutationFn: async (newArticle) => {
      let imageUrl = newArticle.imagen

      if (newArticle.imagen instanceof File) {
        imageUrl = await uploadImage(newArticle.imagen)
      }

      const articleToSave = { ...newArticle, imagen: imageUrl }

      const { data, error } = await supabase
        .from('articulos')
        .insert([articleToSave])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries(['articulos'])
  })

  // 3. Actualizar Artículo (Con borrado de imagen vieja)
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      let imageUrl = updates.imagen

      // Detectamos si hay una IMAGEN NUEVA
      if (updates.imagen instanceof File) {
        // A. Obtener la URL de la imagen actual (la vieja) de la BD
        const { data: oldData } = await supabase
          .from('articulos')
          .select('imagen')
          .eq('id', id)
          .single()

        // B. Subir la nueva imagen
        imageUrl = await uploadImage(updates.imagen)

        // C. Si había una imagen vieja, la borramos del bucket
        if (oldData?.imagen) {
          await deleteImageFromStorage(oldData.imagen)
        }
      }

      const articleToUpdate = { ...updates, imagen: imageUrl }

      const { data, error } = await supabase
        .from('articulos')
        .update(articleToUpdate)
        .eq('id', id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries(['articulos'])
  })

  // 4. Eliminar Artículo (Y su imagen asociada)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // A. Primero obtenemos el registro para saber qué imagen borrar
      const { data: oldData, error: fetchError } = await supabase
        .from('articulos')
        .select('imagen')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // B. Borramos el registro de la Base de Datos
      const { error: deleteError } = await supabase
        .from('articulos')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // C. Si salió bien y tenía imagen, la borramos del Storage
      if (oldData?.imagen) {
        await deleteImageFromStorage(oldData.imagen)
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['articulos'])
  })

  return {
    articulos: query.data || [],
    loading: query.isLoading,
    createArticulo: (data) => createMutation.mutateAsync(data),
    updateArticulo: (id, data) => updateMutation.mutateAsync({ id, ...data }),
    deleteArticulo: (id) => deleteMutation.mutateAsync(id)
  }
}
