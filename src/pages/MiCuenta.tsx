import { useState, type FormEvent } from 'react'
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function MiCuenta() {
  const { currentUser, changePassword } = useApp()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function set(k: keyof typeof form, v: string) {
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

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 560 }}>

        {/* Profile card */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#ec4899,#a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '1.25rem',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="#a855f7" />
              {currentUser?.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>{currentUser?.email}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.15rem' }}>{currentUser?.phone}</div>
          </div>
        </div>

        {/* Change password form */}
        <div className="card" style={{ padding: '1.75rem' }}>
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
              <input type="password" className="form-input" placeholder="••••••••" value={form.current} onChange={e => set('current', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input type="password" className="form-input" placeholder="••••••••" value={form.next} onChange={e => set('next', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input type="password" className="form-input" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
              Actualizar contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
