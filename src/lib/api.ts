import type { Service, User, Appointment } from '../types'

const BASE = '/api'

function token() {
  return localStorage.getItem('ns_token')
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const t = token()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 204) return undefined as T
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error')
  return data as T
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      req<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (data: Omit<User, 'id' | 'role' | 'createdAt'>) =>
      req<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },
  services: {
    list: () => req<Service[]>('/services'),
    create: (data: Omit<Service, 'id'>) =>
      req<Service>('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Service>) =>
      req<Service>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<void>(`/services/${id}`, { method: 'DELETE' }),
  },
  appointments: {
    list: () => req<Appointment[]>('/appointments'),
    create: (data: Omit<Appointment, 'id' | 'createdAt'>) =>
      req<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: Appointment['status']) =>
      req<Appointment>(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },
  users: {
    list: () => req<User[]>('/users'),
    create: (data: Omit<User, 'id' | 'role' | 'createdAt'>) =>
      req<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  },
}
