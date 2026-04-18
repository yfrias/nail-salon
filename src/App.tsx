import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminServices from './pages/admin/AdminServices'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminClients from './pages/admin/AdminClients'
import MiCuenta from './pages/MiCuenta'

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp()
  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp()
  const location = useLocation()
  if (!currentUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/agendar/:serviceId" element={<RequireAuth><BookAppointment /></RequireAuth>} />
          <Route path="/mis-citas" element={<RequireAuth><MyAppointments /></RequireAuth>} />
          <Route path="/mi-cuenta" element={<RequireAuth><MiCuenta /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/clientes" element={<RequireAdmin><AdminClients /></RequireAdmin>} />
          <Route path="/admin/servicios" element={<RequireAdmin><AdminServices /></RequireAdmin>} />
          <Route path="/admin/citas" element={<RequireAdmin><AdminAppointments /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
