import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import MainLayout from './components/layout/MainLayout'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

const HomePage = lazy(() => import('./pages/HomePage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const ViolentometroPage = lazy(() => import('./pages/ViolentometroPage'))
const ComunidadPage = lazy(() => import('./pages/ComunidadPage'))
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'))
const PerfilPage = lazy(() => import('./pages/Auth/PerfilPage'))
const MisAlertasPage = lazy(() => import('./pages/Auth/MisAlertasPage'))
const Page404 = lazy(() => import('./pages/Page404'))

import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')

  const handleModal = () => {
    setModal((prev) => !prev)
  }

  useEffect(() => {
    const getPermissions = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const permissionStatus = await Geolocation.checkPermissions()

          if (permissionStatus.location !== 'granted') {
            const request = await Geolocation.requestPermissions()
            if (request.location !== 'granted') {
              toast.warning(
                'Permite el acceso a tu ubicacion si deseas recibir informacion personalizada sobre campus y servicios cercanos.'
              )
            }
          }
        } else {
          await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000
          })
        }
      } catch (error) {
        console.warn('Permiso denegado o error inicial')
      }
    }

    getPermissions()
  }, [])

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const configurarBarra = async () => {
        try {
          await StatusBar.setOverlaysWebView({ overlay: true })
          await StatusBar.setStyle({ style: Style.Dark })
        } catch (err) {
          console.log('Barra de estado no soportada en web')
        }
      }
      configurarBarra()
    }
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <Toaster richColors position='bottom-right' />

      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route path='/login' element={<AuthPage />} />
          <Route
            path='/perfil'
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout
                  modal={modal}
                  handleModal={handleModal}
                  setMessage={setMessage}
                  message={message}
                />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <HomePage
                  handleModal={handleModal}
                  setMessage={setMessage}
                  message={message}
                />
              }
            />
            <Route path='/carreras-unes' element={<ViolentometroPage />} />
            <Route path='/violentometro' element={<ViolentometroPage />} />
            <Route path='/vida-unes' element={<ComunidadPage />} />
            <Route path='/comunidad' element={<ComunidadPage />} />
            <Route path='/mi-orientacion' element={<MisAlertasPage />} />
            <Route path='/mis-alertas' element={<MisAlertasPage />} />
            <Route path='/chat' element={<ChatPage />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
