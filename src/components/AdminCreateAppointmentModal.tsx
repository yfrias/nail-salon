import { useState, type FormEvent } from 'react'
import { X, UserPlus, Users, Check, AlertCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import type { User } from '../types'

interface Props {
  onClose: () => void
  preselectedClientId?: string
}

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']

function getMinDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

type Mode = 'select' | 'new'

export default function AdminCreateAppointmentModal({ onClose, preselectedClientId }: Props) {
  const { users, services, appointments, adminRegisterClient, addAppointment } = useApp()
  const clients = users.filter(u => u.role === 'client')

  const [mode, setMode] = useState<Mode>(preselectedClientId ? 'select' : 'select')
  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId ?? '')
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', password: '123456' })
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const activeServices = services.filter(s => s.active)
  const selectedService = activeServices.find(s => s.id === serviceId)

  function isTimeBooked(t: string) {
    return appointments.some(a => a.serviceId === serviceId && a.date === date && a.time === t && a.status !== 'cancelled')
  }

  function setNC(k: keyof typeof newClient, v: string) {
    setNewClient(prev => ({ ...prev, [k]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (mode === 'new') {
      if (!newClient.name || !newClient.email || !newClient.phone) {
        setError('Completa todos los datos del cliente')
        return
      }
    } else {
      if (!selectedClientId) {
        setError('Selecciona un cliente')
        return
      }
    }

    if (!serviceId || !date || !time) {
      setError('Completa servicio, fecha y hora')
      return
    }

    let client: User | null = null
    if (mode === 'select') {
      client = clients.find(c => c.id === selectedClientId) ?? null
    } else {
      client = await adminRegisterClient(newClient)
    }

    if (!client) {
      setError('Ya existe un cliente con ese correo')
      return
    }

    await addAppointment({
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      serviceId: selectedService!.id,
      serviceName: selectedService!.name,
      servicePrice: selectedService!.price,
      date,
      time,
      notes,
      status: 'confirmed',
    })
    setDone(true)
  }

  if (done) {
    return (
      <ModalShell onClose={onClose}>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64,
            background: '#d1fae5', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Check size={32} color="#065f46" />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.625rem', color: '#1f2937' }}>¡Cita creada!</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
            La cita fue confirmada directamente.
          </p>
          <button onClick={onClose} className="btn btn-primary" style={{ justifyContent: 'center' }}>Cerrar</button>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell onClose={onClose} title="Crear cita">
      <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Client mode tabs */}
        <div>
          <p className="form-label" style={{ marginBottom: '0.5rem' }}>Cliente</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button type="button" onClick={() => setMode('select')} className="btn btn-sm" style={{
              background: mode === 'select' ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'white',
              color: mode === 'select' ? 'white' : '#6b7280',
              border: mode === 'select' ? 'none' : '2px solid #e5e7eb',
            }}>
              <Users size={14} />
              Cliente existente
            </button>
            <button type="button" onClick={() => setMode('new')} className="btn btn-sm" style={{
              background: mode === 'new' ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'white',
              color: mode === 'new' ? 'white' : '#6b7280',
              border: mode === 'new' ? 'none' : '2px solid #e5e7eb',
            }}>
              <UserPlus size={14} />
              Nuevo cliente
            </button>
          </div>

          {mode === 'select' ? (
            <select
              className="form-input"
              value={selectedClientId}
              onChange={e => setSelectedClientId(e.target.value)}
            >
              <option value="">— Selecciona un cliente —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Nombre completo</label>
                <input className="form-input" placeholder="Ana López" value={newClient.name} onChange={e => setNC('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Correo</label>
                <input type="email" className="form-input" placeholder="ana@correo.com" value={newClient.email} onChange={e => setNC('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" placeholder="555-0000" value={newClient.phone} onChange={e => setNC('phone', e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Contraseña inicial</label>
                <input className="form-input" value={newClient.password} onChange={e => setNC('password', e.target.value)} />
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>El cliente podrá iniciar sesión con esta contraseña</span>
              </div>
            </div>
          )}
        </div>

        {/* Service */}
        <div className="form-group">
          <label className="form-label">Servicio</label>
          <select className="form-input" value={serviceId} onChange={e => { setServiceId(e.target.value); setTime('') }}>
            <option value="">— Selecciona un servicio —</option>
            {activeServices.map(s => (
              <option key={s.id} value={s.id}>{s.name} — ${s.price} ({s.duration} min)</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input type="date" className="form-input" min={getMinDate()} value={date} onChange={e => { setDate(e.target.value); setTime('') }} />
        </div>

        {/* Time slots */}
        {date && serviceId && (
          <div className="form-group">
            <label className="form-label">Horario</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {TIMES.map(t => {
                const booked = isTimeBooked(t)
                return (
                  <button
                    key={t} type="button"
                    disabled={booked}
                    onClick={() => setTime(t)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: time === t ? 'none' : '2px solid #e5e7eb',
                      background: booked ? '#f3f4f6' : time === t ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'white',
                      color: booked ? '#d1d5db' : time === t ? 'white' : '#374151',
                      fontSize: '0.8rem', fontWeight: 500,
                      cursor: booked ? 'not-allowed' : 'pointer',
                      textDecoration: booked ? 'line-through' : 'none',
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notas (opcional)</label>
          <textarea className="form-input" rows={2} placeholder="Color, diseño, indicaciones..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={15} />{error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button type="submit" className="btn btn-primary">
            <Check size={15} />
            Confirmar cita
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ModalShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: '1rem',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto' }}>
        {title && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #fce7f3',
            position: 'sticky', top: 0, background: 'white', zIndex: 1,
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#1f2937' }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
