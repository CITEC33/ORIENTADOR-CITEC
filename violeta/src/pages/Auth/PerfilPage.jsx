import { useAuth } from '../../context/SupabaseAuthContext'
import { Loader2 } from 'lucide-react'
import { usePerfil } from '../../hooks/usePerfil'
import { Header } from '../../components/Perfil/Header'
import { Sidebar } from '../../components/Perfil/Sidebar'
import { Form } from '../../components/Perfil/Form'
import { useEffect } from 'react'

const PerfilPage = () => {
  const { user, signOut, loading: authLoading } = useAuth()
  const {
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
  } = usePerfil({ authLoading, user, signOut })

  useEffect(() => {
    document.title = 'Perfil - Fuerza Violeta'
  }, [])

  if (authLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center'>
        <Loader2 className='w-10 h-10 animate-spin text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 py-4 px-4'>
      <div className='max-w-4xl mx-auto'>
        <Header isProfileComplete={isProfileComplete} />

        <div className='grid gap-6 md:grid-cols-3'>
          <Sidebar
            formData={formData}
            user={user}
            uploadingAvatar={uploadingAvatar}
            handleAvatarChange={handleAvatarChange}
            handleSignOut={handleSignOut}
          />

          <Form
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            user={user}
            emergencyContacts={emergencyContacts}
            handleContactChange={handleContactChange}
            saving={saving}
          />
        </div>
      </div>
    </div>
  )
}

export default PerfilPage
