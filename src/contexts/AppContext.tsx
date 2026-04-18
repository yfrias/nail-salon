import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Service, User, Appointment } from '../types'
import { api } from '../lib/api'

interface AppContextType {
  services: Service[]
  users: User[]
  appointments: Appointment[]
  currentUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: Omit<User, 'id' | 'role' | 'createdAt'>) => Promise<boolean>
  adminRegisterClient: (data: Omit<User, 'id' | 'role' | 'createdAt'>) => Promise<User | null>
  addService: (s: Omit<Service, 'id'>) => Promise<void>
  updateService: (id: string, s: Partial<Service>) => Promise<void>
  deleteService: (id: string) => Promise<void>
  addAppointment: (a: Omit<Appointment, 'id' | 'createdAt'>) => Promise<void>
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>
  cancelAppointment: (id: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  adminChangeUserPassword: (userId: string, newPassword: string) => Promise<boolean>
  toggleUserRole: (userId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

function loadUser(): User | null {
  try { return JSON.parse(localStorage.getItem('ns_current_user') || 'null') } catch { return null }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(loadUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const svcs = await api.services.list()
        setServices(svcs)
        if (localStorage.getItem('ns_token')) {
          const [appts] = await Promise.all([api.appointments.list()])
          setAppointments(appts)
          const user = loadUser()
          if (user?.role === 'admin') {
            const us = await api.users.list()
            setUsers(us)
          }
        }
      } catch (e) {
        console.error('Error cargando datos:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const { user, token } = await api.auth.login(email, password)
      localStorage.setItem('ns_token', token)
      localStorage.setItem('ns_current_user', JSON.stringify(user))
      setCurrentUser(user)
      const appts = await api.appointments.list()
      setAppointments(appts)
      if (user.role === 'admin') {
        const us = await api.users.list()
        setUsers(us)
      }
      return true
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem('ns_token')
    localStorage.removeItem('ns_current_user')
    setCurrentUser(null)
    setAppointments([])
    setUsers([])
  }

  async function register(data: Omit<User, 'id' | 'role' | 'createdAt'>): Promise<boolean> {
    try {
      const { user, token } = await api.auth.register(data)
      localStorage.setItem('ns_token', token)
      localStorage.setItem('ns_current_user', JSON.stringify(user))
      setCurrentUser(user)
      return true
    } catch {
      return false
    }
  }

  async function adminRegisterClient(data: Omit<User, 'id' | 'role' | 'createdAt'>): Promise<User | null> {
    try {
      const user = await api.users.create(data)
      setUsers(prev => [...prev, user])
      return user
    } catch {
      return null
    }
  }

  async function addService(s: Omit<Service, 'id'>): Promise<void> {
    const service = await api.services.create(s)
    setServices(prev => [...prev, service])
  }

  async function updateService(id: string, s: Partial<Service>): Promise<void> {
    const service = await api.services.update(id, s)
    setServices(prev => prev.map(x => x.id === id ? service : x))
  }

  async function deleteService(id: string): Promise<void> {
    await api.services.delete(id)
    setServices(prev => prev.filter(x => x.id !== id))
  }

  async function addAppointment(a: Omit<Appointment, 'id' | 'createdAt'>): Promise<void> {
    const appt = await api.appointments.create(a)
    setAppointments(prev => [...prev, appt])
  }

  async function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    const appt = await api.appointments.updateStatus(id, status)
    setAppointments(prev => prev.map(a => a.id === id ? appt : a))
  }

  async function cancelAppointment(id: string): Promise<void> {
    const appt = await api.appointments.updateStatus(id, 'cancelled')
    setAppointments(prev => prev.map(a => a.id === id ? appt : a))
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    if (!currentUser) return false
    try {
      await api.users.changePassword(currentUser.id, currentPassword, newPassword)
      return true
    } catch {
      return false
    }
  }

  async function adminChangeUserPassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      await api.users.changePassword(userId, null, newPassword)
      return true
    } catch {
      return false
    }
  }

  async function toggleUserRole(userId: string): Promise<void> {
    const updated = await api.users.toggleRole(userId)
    setUsers(prev => prev.map(u => u.id === userId ? updated : u))
  }

  return (
    <AppContext.Provider value={{
      services, users, appointments, currentUser, loading,
      login, logout, register, adminRegisterClient,
      addService, updateService, deleteService,
      addAppointment, updateAppointmentStatus, cancelAppointment,
      changePassword, adminChangeUserPassword, toggleUserRole,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
