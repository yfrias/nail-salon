import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle, DollarSign } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']

function getMinDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function BookAppointment() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const { services, currentUser, appointments, addAppointment, loading } = useApp()
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>Cargando...</div>
  )

  const service = services.find(s => s.id === serviceId)
  if (!service) return <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>Servicio no encontrado.</div>
  if (!currentUser) { navigate('/login'); return null }

  function isTimeBooked(t: string) {
    return appointments.some(a => a.serviceId === serviceId && a.date === date && a.time === t && a.status !== 'cancelled')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    try {
      await addAppointment({
        clientId: currentUser!.id,
        clientName: currentUser!.name,
        clientEmail: currentUser!.email,
        clientPhone: currentUser!.phone,
        serviceId: service!.id,
        serviceName: service!.name,
        servicePrice: service!.price,
        date,
        time,
        notes,
        status: 'pending',
      })
      setDone(true)
    } catch {
      setSubmitError('No se pudo solicitar la cita. Intenta de nuevo.')
    }
  }

  if (done) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 4rem)',
        background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div className="card fade-in" style={{ maxWidth: 440, width: '100%', padding: '3rem', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <CheckCircle size={36} color="#065f46" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#1f2937' }}>¡Cita solicitada!</h2>
          <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>
            Tu solicitud para <strong>{service.name}</strong> el <strong>{date}</strong> a las <strong>{time}</strong> ha sido enviada.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Recibirás confirmación cuando el administrador apruebe tu cita.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/mis-citas')} className="btn btn-primary">Ver mis citas</button>
            <button onClick={() => navigate('/servicios')} className="btn btn-secondary">Más servicios</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 4rem)',
      background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Service summary */}
        <div className="card fade-in">
          <div style={{ height: 200, overflow: 'hidden' }}>
            <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/600x400/fce7f3/db2777?text=${encodeURIComponent(service.name)}` }} />
          </div>
          <div style={{ padding: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              color: 'white', padding: '0.2rem 0.75rem',
              borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
              marginBottom: '0.75rem', textTransform: 'uppercase',
            }}>{service.category}</span>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#1f2937' }}>{service.name}</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{service.description}</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <Clock size={15} />{service.duration} min
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#be185d', fontWeight: 700, fontSize: '1.1rem' }}>
                <DollarSign size={16} />{service.price}
              </span>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="card fade-in">
          <div style={{ padding: '1.5rem 1.5rem 0', borderBottom: '1px solid #fce7f3', paddingBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#1f2937' }}>Selecciona fecha y hora</h2>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Eres: <strong>{currentUser.name}</strong></p>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label"><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />Fecha</label>
              <input type="date" className="form-input" min={getMinDate()} value={date} onChange={e => { setDate(e.target.value); setTime('') }} required />
            </div>

            {date && (
              <div className="form-group">
                <label className="form-label"><Clock size={13} style={{ display: 'inline', marginRight: 4 }} />Horario disponible</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
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
                          background: booked ? '#f3f4f6' : time === t ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'white',
                          color: booked ? '#d1d5db' : time === t ? 'white' : '#374151',
                          fontSize: '0.8rem',
                          fontWeight: 500,
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

            <div className="form-group">
              <label className="form-label">Notas adicionales (opcional)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Color preferido, diseño deseado, etc."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {submitError && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                {submitError}
              </div>
            )}

            <button type="submit" disabled={!date || !time} className="btn btn-primary" style={{
              justifyContent: 'center',
              padding: '0.75rem',
              opacity: (!date || !time) ? 0.5 : 1,
            }}>
              Solicitar cita
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
