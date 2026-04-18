import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { User, Lock, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function MiCuenta() {
  const { currentUser, changePassword } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'password' ? 'password' : 'profile'

  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function setField(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setStatus('idle')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('idle')
    if (form.next !== form.confirm) { setStatus('error'); setMsg('Las contraseñas nuevas no coinciden'); return }
    if (form.next.length < 6) { setStatus('error'); setMsg('La contraseña debe tener al menos 6 caracteres'); return }
    const ok = await changePassword(form.current, form.next)
    if (ok) {
      setStatus('ok')
      setMsg('Contraseña actualizada correctamente')
      setForm({ current: '', next: '', confirm: '' })
    } else {
      setStatus('error')
      setMsg('Contraseña actual incorrecta')
    }
  }

  const initials = currentUser?.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Mi Cuenta</h1>
        <p>Gestiona tu información personal</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 580 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.75rem', background: '#f9fafb', borderRadius: '0.75rem', padding: '0.25rem' }}>
          {[
            { key: 'profile', label: 'Datos personales', icon: User },
            { key: 'password', label: 'Cambiar contraseña', icon: Lock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSearchParams(key === 'password' ? { tab: 'password' } : {})}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                background: tab === key ? 'white' : 'transparent',
                color: tab === key ? '#be185d' : '#6b7280',
                boxShadow: tab === key ? '0 1px 4px rgb(0 0 0 / 0.08)' : 'none',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'profile' ? (
          <div className="card fade-in" style={{ padding: '1.75rem' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#ec4899,#a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '1.35rem',
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1f2937' }}>{currentUser?.name}</div>
                <div style={{
                  fontSize: '0.7rem', background: currentUser?.role === 'admin' ? '#ede9fe' : '#fce7f3',
                  color: currentUser?.role === 'admin' ? '#7c3aed' : '#db2777',
                  padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600,
                  display: 'inline-block', marginTop: '0.3rem',
                }}>
                  {currentUser?.role === 'admin' ? 'Administrador' : 'Cliente'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: '#fdf2f8', borderRadius: '0.625rem' }}>
                <Mail size={16} color="#ec4899" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo electrónico</div>
                  <div style={{ fontWeight: 500, color: '#374151', fontSize: '0.9rem', marginTop: '0.1rem' }}>{currentUser?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: '#fdf2f8', borderRadius: '0.625rem' }}>
                <Phone size={16} color="#a855f7" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teléfono</div>
                  <div style={{ fontWeight: 500, color: '#374151', fontSize: '0.9rem', marginTop: '0.1rem' }}>{currentUser?.phone || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card fade-in" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={17} color="#ec4899" />
              Cambiar contraseña
            </h2>

            {status === 'ok' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#d1fae5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                <CheckCircle size={16} />{msg}
              </div>
            )}
            {status === 'error' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />{msg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">Contraseña actual</label>
                <input type="password" className="form-input" placeholder="••••••••" value={form.current} onChange={e => setField('current', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nueva contraseña</label>
                <input type="password" className="form-input" placeholder="••••••••" value={form.next} onChange={e => setField('next', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input type="password" className="form-input" placeholder="••••••••" value={form.confirm} onChange={e => setField('confirm', e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                Actualizar contraseña
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
