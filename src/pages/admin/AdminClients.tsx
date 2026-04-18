import { useState } from 'react'
import {
  Users, Calendar, DollarSign, TrendingUp,
  Phone, Mail, Search, Plus, CalendarPlus,
  Award, Clock, UserCheck,
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import type { User } from '../../types'
import AdminCreateAppointmentModal from '../../components/AdminCreateAppointmentModal'

export default function AdminClients() {
  const { users, appointments } = useApp()
  const clients = users.filter(u => u.role === 'client')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [preselectedId, setPreselectedId] = useState<string | undefined>()

  // --- Global stats ---
  const totalAppointments = appointments.length
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
  const totalRevenue = appointments.filter(a => a.status === 'confirmed').reduce((s, a) => s + a.servicePrice, 0)
  const avgPerClient = clients.length ? (totalRevenue / clients.length).toFixed(0) : 0

  // --- Per-client stats ---
  function clientStats(client: User) {
    const mine = appointments.filter(a => a.clientId === client.id)
    const confirmed = mine.filter(a => a.status === 'confirmed')
    const pending = mine.filter(a => a.status === 'pending')
    const cancelled = mine.filter(a => a.status === 'cancelled')
    const spent = confirmed.reduce((s, a) => s + a.servicePrice, 0)
    const last = [...mine].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    return { total: mine.length, confirmed: confirmed.length, pending: pending.length, cancelled: cancelled.length, spent, last }
  }

  // Top client by spending
  const ranked = [...clients].map(c => ({ ...c, ...clientStats(c) })).sort((a, b) => b.spent - a.spent)

  const filtered = ranked.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  function openModal(clientId?: string) {
    setPreselectedId(clientId)
    setModalOpen(true)
  }

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Clientes</h1>
        <p>Gestiona tus clientes y sus estadísticas</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* Global stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Clientes registrados', value: clients.length, icon: Users, color: '#6366f1', bg: '#ede9fe' },
            { label: 'Total de citas', value: totalAppointments, icon: Calendar, color: '#ec4899', bg: '#fce7f3' },
            { label: 'Citas confirmadas', value: confirmedAppointments, icon: UserCheck, color: '#10b981', bg: '#d1fae5' },
            { label: 'Ingresos totales', value: `$${totalRevenue}`, icon: DollarSign, color: '#f59e0b', bg: '#fef3c7' },
            { label: 'Gasto promedio/cliente', value: `$${avgPerClient}`, icon: TrendingUp, color: '#8b5cf6', bg: '#ede9fe' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: 44, height: 44, background: bg, borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top 3 clients */}
        {ranked.length >= 3 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#f59e0b" />
              Top clientes
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {ranked.slice(0, 3).map((c, i) => (
                <div key={c.id} style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: i === 0 ? 'linear-gradient(135deg,#fef3c7,#fde68a)' : i === 1 ? 'linear-gradient(135deg,#f3f4f6,#e5e7eb)' : 'linear-gradient(135deg,#fdf2f8,#fce7f3)',
                  border: i === 0 ? '2px solid #f59e0b' : i === 1 ? '2px solid #d1d5db' : '2px solid #fbcfe8',
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : '#f9a8d4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: '1rem',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>${c.spent} gastados · {c.confirmed} citas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 340 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input className="form-input" style={{ paddingLeft: '2.5rem', width: '100%' }} placeholder="Buscar por nombre, email o teléfono..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => openModal()} className="btn btn-primary">
            <Plus size={15} />
            Nuevo cliente + cita
          </button>
        </div>

        {/* Client list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>{search ? 'No se encontraron clientes' : 'No hay clientes registrados aún'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(c => (
              <ClientRow key={c.id} client={c} stats={{ total: c.total, confirmed: c.confirmed, pending: c.pending, cancelled: c.cancelled, spent: c.spent, last: c.last }} onCreateAppointment={() => openModal(c.id)} />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <AdminCreateAppointmentModal
          preselectedClientId={preselectedId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

interface ClientRowProps {
  client: User
  stats: {
    total: number
    confirmed: number
    pending: number
    cancelled: number
    spent: number
    last: { date: string; serviceName: string } | undefined
  }
  onCreateAppointment: () => void
}

function ClientRow({ client, stats, onCreateAppointment }: ClientRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { appointments } = useApp()
  const mine = appointments.filter(a => a.clientId === client.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const initials = client.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="card fade-in">
      <div
        style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#ec4899,#a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '1rem',
        }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>{client.name}</div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#6b7280' }}>
              <Mail size={12} />{client.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#6b7280' }}>
              <Phone size={12} />{client.phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              <Clock size={12} />Desde {client.createdAt}
            </span>
          </div>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#be185d', fontFamily: 'Playfair Display, serif' }}>{stats.total}</div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>citas</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#10b981', fontFamily: 'Playfair Display, serif' }}>{stats.confirmed}</div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>confirmadas</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#f59e0b', fontFamily: 'Playfair Display, serif' }}>${stats.spent}</div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>gastados</div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={e => { e.stopPropagation(); onCreateAppointment() }}
          className="btn btn-primary btn-sm"
        >
          <CalendarPlus size={14} />
          Nueva cita
        </button>
      </div>

      {/* Expanded: appointment history */}
      {expanded && (
        <div style={{ borderTop: '1px solid #fce7f3', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Historial de citas
          </h4>
          {mine.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Sin citas registradas</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mine.map(a => (
                <div key={a.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0.875rem',
                  background: '#f9fafb', borderRadius: '0.5rem',
                  flexWrap: 'wrap', gap: '0.5rem',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ fontWeight: 500, color: '#374151' }}>{a.serviceName}</span>
                  <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={13} />{a.date} {a.time}
                  </span>
                  <span style={{ fontWeight: 600, color: '#be185d' }}>${a.servicePrice}</span>
                  <span className={`badge badge-${a.status}`}>
                    {a.status === 'pending' ? 'Pendiente' : a.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Spending bar */}
          {stats.total > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {(['confirmed', 'pending', 'cancelled'] as const).map(status => {
                const count = status === 'confirmed' ? stats.confirmed : status === 'pending' ? stats.pending : stats.cancelled
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
                const color = status === 'confirmed' ? '#10b981' : status === 'pending' ? '#f59e0b' : '#ef4444'
                const label = status === 'confirmed' ? 'Confirmadas' : status === 'pending' ? 'Pendientes' : 'Canceladas'
                if (count === 0) return null
                return (
                  <div key={status} title={`${label}: ${count}`} style={{
                    flex: pct, height: 8, borderRadius: 4, background: color,
                    minWidth: 8, transition: 'flex 0.3s',
                  }} />
                )
              })}
            </div>
          )}
          {stats.total > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />Confirmadas: {stats.confirmed}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />Pendientes: {stats.pending}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />Canceladas: {stats.cancelled}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
