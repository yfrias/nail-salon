import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Register() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    const ok = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    if (ok) navigate('/')
    else setError('Ya existe una cuenta con ese correo')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 4rem)',
      background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem',
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            borderRadius: '50%',
            width: 56, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#1f2937' }}>Crear cuenta</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Regístrate gratis y agenda tus citas</p>
        </div>

        {error && (
          <div style={{
            display: 'flex', gap: '0.5rem', alignItems: 'center',
            background: '#fee2e2', color: '#991b1b',
            padding: '0.75rem 1rem', borderRadius: '0.5rem',
            fontSize: '0.875rem', marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label className="form-label"><User size={13} style={{ display: 'inline', marginRight: 4 }} />Nombre completo</label>
            <input className="form-input" placeholder="Ana López" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label"><Mail size={13} style={{ display: 'inline', marginRight: 4 }} />Correo electrónico</label>
            <input type="email" className="form-input" placeholder="ana@correo.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label"><Phone size={13} style={{ display: 'inline', marginRight: 4 }} />Teléfono</label>
            <input type="tel" className="form-input" placeholder="555-0000" value={form.phone} onChange={e => set('phone', e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label"><Lock size={13} style={{ display: 'inline', marginRight: 4 }} />Contraseña</label>
              <input type="password" className="form-input" placeholder="••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar</label>
              <input type="password" className="form-input" placeholder="••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}>
            Crear cuenta gratis
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#db2777', fontWeight: 600 }}>Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
