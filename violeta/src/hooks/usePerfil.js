import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/customSupabaseClient'
import { toast } from 'sonner'

export const usePerfil = ({ authLoading, user, signOut }) => {
  const navigate = useNavigate()

  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(true)

  const [formData, setFormData] = useState({
    nombre_completo: '',
    apellido_p: '',
    apellido_m: '',
    telefono: '',
    direccion: '',
    foto: ''
  })

  const [emergencyContacts, setEmergencyContacts] = useState([
    { nombre_completo: '', telefono: '' },
    { nombre_completo: '', telefono: '' }
  ])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const checkCompleteness = (data, contacts) => {
    const hasApellidoP = !!data.apellido_p
    const hasApellidoM = !!data.apellido_m
    const hasPhone = !!data.telefono
    const hasAddress = !!data.direccion
    const hasContact = contacts.some((c) => c.nombre_completo && c.telefono)

    return hasApellidoP && hasApellidoM && hasPhone && hasAddress && hasContact
  }

  const loadProfile = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('usuarias')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      const { data: contactsData, error: contactsError } = await supabase
        .from('contactos_emergencia')
        .select('*')
        .eq('user_id', user.id)

      if (contactsError) throw contactsError

      if (userData) {
        setFormData({
          nombre_completo: userData.nombre_completo || '',
          apellido_p: userData.apellido_p || '',
          apellido_m: userData.apellido_m || '',
          telefono: userData.telefono || '',
          direccion: userData.direccion || '',
          foto: userData.foto || ''
        })
      }

      const loadedContacts = [
        { nombre_completo: '', telefono: '' },
        { nombre_completo: '', telefono: '' }
      ]

      if (contactsData && contactsData.length > 0) {
        contactsData.forEach((contact, index) => {
          if (index < 2) {
            loadedContacts[index] = {
              nombre_completo: contact.nombre_completo,
              telefono: contact.telefono
            }
          }
        })
      }
      setEmergencyContacts(loadedContacts)

      setIsProfileComplete(checkCompleteness(userData, contactsData || []))
    } catch (error) {
      console.error('Error al cargar el perfil')
      toast.error('No se pudo cargar el perfil')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleContactChange = (index, field, value) => {
    const newContacts = [...emergencyContacts]
    newContacts[index] = {
      ...newContacts[index],
      [field]: value
    }
    setEmergencyContacts(newContacts)
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 4MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }

    setUploadingAvatar(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl }
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, foto: publicUrl }))

      await supabase
        .from('usuarias')
        .update({ foto: publicUrl })
        .eq('id', user.id)

      toast.success('Foto de perfil actualizada')
    } catch (error) {
      console.error('Error al cargar el avatar')
      toast.error('No se pudo subir la imagen')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error: userUpdateError } = await supabase
        .from('usuarias')
        .update({
          nombre_completo: formData.nombre_completo,
          apellido_p: formData.apellido_p,
          apellido_m: formData.apellido_m,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
        .eq('id', user.id)

      if (userUpdateError) throw userUpdateError

      const { error: deleteError } = await supabase
        .from('contactos_emergencia')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      const contactsToInsert = emergencyContacts
        .filter(
          (c) => c.nombre_completo.trim() !== '' && c.telefono.trim() !== ''
        )
        .map((c) => ({
          user_id: user.id,
          nombre_completo: c.nombre_completo,
          telefono: c.telefono
        }))

      if (contactsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('contactos_emergencia')
          .insert(contactsToInsert)

        if (insertError) throw insertError
      }

      toast.success('Perfil actualizado correctamente')
      await loadProfile()
    } catch (error) {
      console.error('Error al actualizar el perfil')
      toast.error('Ocurrió un error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return {
    isProfileComplete,
    formData,
    uploadingAvatar,
    emergencyContacts,
    saving,
    handleAvatarChange,
    handleSignOut,
    handleSubmit,
    handleChange,
    handleContactChange
  }
}
