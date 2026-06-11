import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificacionesProvider } from './context/NotificacionesContext.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NotificacionesProvider>
          <App />
        </NotificacionesProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
)
