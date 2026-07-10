import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import MainLayout from './components/layout/MainLayout'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

const HomePage = lazy(() => import('./pages/HomePage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const CarrerasPage = lazy(() => import('./pages/CarrerasPage'))
const CarreraDetailPage = lazy(() => import('./pages/CarreraDetailPage'))
const TestVocacionalPage = lazy(() => import('./pages/TestVocacionalPage'))
const ComunidadPage = lazy(() => import('./pages/ComunidadPage'))
const MisAlertasPage = lazy(() => import('./pages/Auth/MisAlertasPage'))
const AquilaAuthPage = lazy(() => import('./pages/Auth/AquilaAuthPage'))
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'))
const AdminKnowledgePage = lazy(() => import('./pages/AdminKnowledgePage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const Page404 = lazy(() => import('./pages/Page404'))

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
        <AuthProvider>
          <ScrollToTop />

          <Routes>
            {/* Ruta pública: auth (formulario login/registro) */}
            <Route path='/auth' element={<AquilaAuthPage />} />
            <Route path='/login' element={<Navigate to='/auth' replace />} />

            {/* Rutas protegidas: requieren usuario logueado */}
            <Route
              element={
                <RequireAuth>
                  <MainLayout
                    modal={modal}
                    handleModal={handleModal}
                    message={message}
                  />
                </RequireAuth>
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
              <Route path='/carreras-unes' element={<CarrerasPage />} />
              <Route path='/carreras-unes/:slug' element={<CarreraDetailPage />} />
              <Route path='/test-vocacional' element={<TestVocacionalPage />} />
              <Route path='/vida-unes' element={<ComunidadPage />} />
              <Route path='/comunidad' element={<ComunidadPage />} />
              <Route path='/mi-orientacion' element={<MisAlertasPage />} />
              <Route path='/perfil' element={<MisAlertasPage />} />
              <Route path='/mis-alertas' element={<MisAlertasPage />} />
              <Route path='/chat' element={<ChatPage />} />
              <Route path='/admin' element={<AdminPanelPage />} />
              <Route path='/admin/knowledge' element={<AdminKnowledgePage />} />
              <Route path='/admin/users' element={<AdminUsersPage />} />
              <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
            </Route>
            <Route path='*' element={<Page404 />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
