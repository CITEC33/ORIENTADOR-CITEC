import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const IncidentesPage = lazy(() => import('./pages/IncidentesPage'))
const EventosPage = lazy(() => import('./pages/EventosPage'))
const ArticulosPage = lazy(() => import('./pages/ArticulosPage'))
const AlertasPage = lazy(() => import('./pages/AlertasPage'))
const UsuariasPage = lazy(() => import('./pages/UsuariasPage'))
const AdminsPage = lazy(() => import('./pages/AdminsPage'))
const Page404 = lazy(() => import('./pages/Page404'))

import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { AppLayout } from './components/AppLayout'
import { Loading } from './components/Loading'

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Toaster richColors position='bottom-right' />

      <Routes>
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/' element={<DashboardPage />} />
          <Route path='/incidentes' element={<IncidentesPage />} />
          <Route path='/eventos' element={<EventosPage />} />
          <Route path='/articulos' element={<ArticulosPage />} />
          <Route path='/alertas' element={<AlertasPage />} />
          <Route path='/usuarias' element={<UsuariasPage />} />
          <Route path='/administradores' element={<AdminsPage />} />
        </Route>

        <Route path='*' element={<Page404 />} />
      </Routes>
    </Suspense>
  )
}

export default App
