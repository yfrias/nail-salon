import { useState } from 'react'
import { Calendar, Clock, DollarSign, User, Phone, FileText, CheckCircle, XCircle, CalendarPlus } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import type { Appointment } from '../../types'
import AdminCreateAppointmentModal from '../../components/AdminCreateAppointmentModal'

const FILTERS = ['Todas', 'Pendientes', 'Confirmadas', 'Canceladas']

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

export default function AdminAppointments() {
  const { appointments, updateAppointmentStatus, cancelAppointment } = useApp()
  const [filter, setFilter] = useState('Todas')
  const [dateFilter, setDateFilter] = useState('')
  const [createModal, setCreateModal] = useState(false)

  const filtered = appointments.filter(a => {
    const matchStatus =
      filter === 'Todas' ||
      (filter === 'Pendientes' && a.status === 'pending') ||
      (filter === 'Confirmadas' && a.status === 'confirmed') ||
      (filter === 'Canceladas' && a.status === 'cancelled')
    const matchDate = !dateFilter || a.date === dateFilter
    return matchStatus && matchDate
  }).sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (b.status === 'pending' && a.status !== 'pending') return 1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  function AppCard({ a }: { a: Appointment }) {
    return (
      <div className="card fade-in" style={{
        padding: '1.25rem',
        borderLeft: `4px solid ${a.status === 'pending' ? '#f59e0b' : a.status === 'confirmed' ? '#10b981' : '#ef4444'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1f2937' }}>{a.serviceName}</h3>
              <span className={`badge badge-${a.status}`}>{statusLabel[a.status]}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem 1.25rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#374151' }}>
                <User size={14} color="#9ca3af" />{a.clientName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#374151' }}>
                <Phone size={14} color="#9ca3af" />{a.clientPhone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#374151' }}>
                <Calendar size={14} color="#9ca3af" />{a.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#374151' }}>
                <Clock size={14} color="#9ca3af" />{a.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9rem', fontWeight: 600, color: '#be185d' }}>
                <DollarSign size={14} />{a.servicePrice}
              </span>
            </div>

            {a.notes && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', marginTop: '0.625rem', fontSize: '0.8rem', color: '#6b7280', background: '#f9fafb', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>
                <FileText size={13} style={{ marginTop: 1, flexShrink: 0 }} />
                {a.notes}
              </div>
            )}
          </div>

          {a.status !== 'cancelled' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              {a.status === 'pending' && (
                <button
                  onClick={async () => updateAppointmentStatus(a.id, 'confirmed')}
                  className="btn btn-success btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <CheckCircle size={14} />
                  Confirmar
                </button>
              )}
              <button
                onClick={async () => { if (confirm('¿Cancelar esta cita?')) await cancelAppointment(a.id) }}
                className="btn btn-danger btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <XCircle size={14} />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const pendingCount = appointments.filter(a => a.status === 'pending').length

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Gestión de Citas</h1>
        <p>Aprueba, confirma o cancela solicitudes de citas</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {pendingCount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #f59e0b',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            fontSize: '0.9rem', color: '#92400e', fontWeight: 500,
          }}>
            <span style={{ fontSize: '1.2rem' }}>⏳</span>
            {pendingCount} cita(s) pendiente(s) de aprobación
          </div>
        )}

        {/* Filters + create button */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setCreateModal(true)} className="btn btn-primary">
            <CalendarPlus size={15} />
            Crear cita
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="btn btn-sm" style={{
                background: filter === f ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'white',
                color: filter === f ? 'white' : '#6b7280',
                border: filter === f ? 'none' : '2px solid #e5e7eb',
              }}>
                {f}
              </button>
            ))}
          </div>
          <input type="date" className="form-input" style={{ width: 'auto' }} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          {dateFilter && <button onClick={() => setDateFilter('')} className="btn btn-sm btn-secondary">Limpiar fecha</button>}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No hay citas en esta categoría</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(a => <AppCard key={a.id} a={a} />)}
          </div>
        )}
      </div>

      {createModal && <AdminCreateAppointmentModal onClose={() => setCreateModal(false)} />}
    </div>
  )
}
