import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useState } from 'react'

export const useLogin = () => {
  const navigate = useNavigate()
  const { signInAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInAdmin(email, password)
      navigate('/')
    } catch (err) {
      let mensaje = 'Error al iniciar sesión'

      console.log(err)

      if (err.message.includes('Invalid login credentials')) {
        mensaje = 'Correo o contraseña incorrectos.'
      } else if (err.message.includes('Acceso denegado')) {
        mensaje = 'Correo o contraseña incorrectos.'
      } else {
        mensaje = err.message
      }

      setError(mensaje)
    } finally {
      setLoading(false)
    }
  }

  return {
    error,
    email,
    password,
    showPassword,
    loading,
    handleSubmit,
    setEmail,
    setPassword,
    setShowPassword
  }
}
