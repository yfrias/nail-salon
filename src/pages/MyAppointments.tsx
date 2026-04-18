import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, DollarSign, FileText, Plus } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import type { Appointment } from '../types'
import ConfirmModal from '../components/ConfirmModal'

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export default function MyAppointments() {
  const { currentUser, appointments, cancelAppointment } = useApp()
  const navigate = useNavigate()
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)

  if (!currentUser) { navigate('/login'); return null }

  const mine = appointments.filter(a => a.clientId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const active = mine.filter(a => a.status !== 'cancelled' && a.status !== 'completed')
  const completed = mine.filter(a => a.status === 'completed')
  const cancelled = mine.filter(a => a.status === 'cancelled')

  function canCancel(a: Appointment) {
    return (a.status === 'pending' || a.status === 'confirmed') && new Date(a.date) > new Date()
  }

  function AppCard({ a }: { a: Appointment }) {
    return (
      <div className="card fade-in" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.375rem' }}>{a.serviceName}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#6b7280' }}>
                <Calendar size={14} />{a.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#6b7280' }}>
                <Clock size={14} />{a.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9rem', fontWeight: 600, color: '#be185d' }}>
                <DollarSign size={14} />{a.servicePrice}
              </span>
            </div>
            {a.notes && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
                <FileText size={13} style={{ marginTop: 2 }} />
                {a.notes}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge badge-${a.status}`}>{statusLabel[a.status]}</span>
            {canCancel(a) && (
              <button
                onClick={() => setCancelTarget(a)}
                className="btn btn-danger btn-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Mis Citas</h1>
        <p>Gestiona tus citas y solicitudes</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/servicios')} className="btn btn-primary">
            <Plus size={16} />
            Nueva cita
          </button>
        </div>

        {mine.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ marginBottom: '1rem' }}>No tienes citas aún</p>
            <button onClick={() => navigate('/servicios')} className="btn btn-primary">Agendar primera cita</button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#374151' }}>
                  Citas activas ({active.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {active.map(a => <AppCard key={a.id} a={a} />)}
                </div>
              </section>
            )}
            {completed.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#1e40af' }}>
                  Citas completadas ({completed.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8 }}>
                  {completed.map(a => <AppCard key={a.id} a={a} />)}
                </div>
              </section>
            )}
            {cancelled.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#9ca3af' }}>
                  Citas canceladas ({cancelled.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6 }}>
                  {cancelled.map(a => <AppCard key={a.id} a={a} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {cancelTarget && (
        <ConfirmModal
          title="Cancelar cita"
          message={`Estimado/a cliente, ¿está seguro/a que desea cancelar la cita de ${cancelTarget.serviceName} del ${cancelTarget.date} a las ${cancelTarget.time}?`}
          confirmLabel="Sí, cancelar"
          cancelLabel="No, volver"
          onConfirm={async () => {
            await cancelAppointment(cancelTarget.id)
            setCancelTarget(null)
          }}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  )
}
