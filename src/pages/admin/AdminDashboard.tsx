import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Sparkles, Users, TrendingUp, Clock, CalendarPlus } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import AdminCreateAppointmentModal from '../../components/AdminCreateAppointmentModal'

export default function AdminDashboard() {
  const { services, appointments, users } = useApp()
  const [createModal, setCreateModal] = useState(false)

  const pending = appointments.filter(a => a.status === 'pending')
  const confirmed = appointments.filter(a => a.status === 'confirmed')
  const clients = users.filter(u => u.role === 'client')
  const revenue = appointments.filter(a => a.status === 'confirmed').reduce((s, a) => s + a.servicePrice, 0)

  const recent = [...appointments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  // Most performed service
  const serviceCounts = appointments.reduce<Record<string, number>>((acc, a) => {
    acc[a.serviceName] = (acc[a.serviceName] ?? 0) + 1
    return acc
  }, {})
  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]

  const stats = [
    { label: 'Citas pendientes', value: pending.length, icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Citas confirmadas', value: confirmed.length, icon: Calendar, color: '#10b981', bg: '#d1fae5' },
    { label: 'Clientes registrados', value: clients.length, icon: Users, color: '#6366f1', bg: '#ede9fe' },
    { label: 'Ingresos (confirmados)', value: `$${revenue}`, icon: TrendingUp, color: '#ec4899', bg: '#fce7f3' },
    { label: 'Proceso más realizado', value: topService ? topService[0] : '—', subValue: topService ? `${topService[1]} vez${topService[1] !== 1 ? 'es' : ''}` : undefined, icon: Sparkles, color: '#a855f7', bg: '#f0e7ff' },
  ]

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Panel de Administración</h1>
        <p>Resumen general del negocio</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {stats.map(({ label, value, icon: Icon, color, bg, subValue }) => (
            <div key={label} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 52, height: 52, background: bg, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} color={color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: subValue ? '1.1rem' : '1.75rem', fontWeight: 700, color: '#1f2937', fontFamily: 'Playfair Display, serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                {subValue && <div style={{ fontSize: '0.8rem', color, fontWeight: 600 }}>{subValue}</div>}
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {/* Create appointment CTA */}
          <div
            onClick={() => setCreateModal(true)}
            className="card"
            style={{
              padding: '1.5rem', cursor: 'pointer',
              background: 'linear-gradient(135deg, #fdf4ff, #ede9fe)',
              border: '2px solid #d8b4fe',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
          >
            <CalendarPlus size={28} color="#7c3aed" />
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937' }}>Crear Cita</div>
              <div style={{ fontSize: '0.8rem', color: '#7c3aed' }}>Para cliente nuevo o existente</div>
            </div>
          </div>

          <Link to="/admin/clientes" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              padding: '1.5rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
            >
              <Users size={28} color="#6366f1" />
              <div>
                <div style={{ fontWeight: 600, color: '#1f2937' }}>Ver Clientes</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{clients.length} registrados</div>
              </div>
            </div>
          </Link>

          <Link to="/admin/citas" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              padding: '1.5rem',
              background: pending.length > 0 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : undefined,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
            >
              <Calendar size={28} color={pending.length > 0 ? '#92400e' : '#ec4899'} />
              <div>
                <div style={{ fontWeight: 600, color: '#1f2937' }}>Gestionar Citas</div>
                {pending.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 500 }}>
                    ⚠️ {pending.length} cita(s) esperando aprobación
                  </div>
                )}
              </div>
            </div>
          </Link>
          <Link to="/admin/servicios" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              padding: '1.5rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
            >
              <Sparkles size={28} color="#a855f7" />
              <div>
                <div style={{ fontWeight: 600, color: '#1f2937' }}>Gestionar Servicios</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{services.filter(s => s.active).length} servicios activos</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent appointments */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#1f2937' }}>Citas recientes</h2>
          {recent.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No hay citas aún</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #fce7f3' }}>
                    {['Cliente', 'Servicio', 'Fecha', 'Hora', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: '#6b7280', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem' }}>{a.clientName}</td>
                      <td style={{ padding: '0.75rem' }}>{a.serviceName}</td>
                      <td style={{ padding: '0.75rem' }}>{a.date}</td>
                      <td style={{ padding: '0.75rem' }}>{a.time}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge badge-${a.status}`}>
                          {a.status === 'pending' ? 'Pendiente' : a.status === 'confirmed' ? 'Confirmada' : a.status === 'completed' ? 'Completada' : 'Cancelada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {createModal && <AdminCreateAppointmentModal onClose={() => setCreateModal(false)} />}
    </div>
  )
}
