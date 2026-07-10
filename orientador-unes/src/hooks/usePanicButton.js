import { useState } from 'react'
import { toast } from 'sonner'
import { useGetLocation } from './useGetLocation'
import { AppLauncher } from '@capacitor/app-launcher'
import { Capacitor } from '@capacitor/core'
import { useAuth } from '../context/AuthContext'

export const usePanicButton = () => {
  const { getFullLocation } = useGetLocation()
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()

  return { loading }
}
