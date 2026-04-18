export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  image: string
  active: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string
  role: 'client' | 'admin'
  createdAt: string
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceId: string
  serviceName: string
  servicePrice: number
  date: string
  time: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}
