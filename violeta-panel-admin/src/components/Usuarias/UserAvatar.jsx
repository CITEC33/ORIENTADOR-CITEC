import { useState } from 'react'
import { User } from 'lucide-react'

export function UserAvatar({ user, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false)

  const photoUrl = user?.foto

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-32 h-32 text-5xl'
  }

  const sizeClass = sizes[size] || sizes.md

  if (photoUrl && !imageError) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden bg-gray-800 flex-shrink-0 ${className}`}
      >
        <img
          src={photoUrl}
          alt={user?.nombre_completo || 'Usuario'}
          className='w-full h-full object-cover'
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  const initial = user?.nombre_completo?.charAt(0).toUpperCase() || '?'

  if (initial !== '?') {
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg ${className}`}
        title={user?.nombre_completo}
      >
        {initial}
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gray-800 flex items-center justify-center text-gray-500 flex-shrink-0 border border-gray-700 ${className}`}
      title='Sin foto de perfil'
    >
      <User className='w-1/2 h-1/2' />
    </div>
  )
}
