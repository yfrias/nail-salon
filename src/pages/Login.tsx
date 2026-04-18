import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const ok = await login(email, password)
    if (ok) {
      const stored = JSON.parse(localStorage.getItem('ns_current_user') || 'null')
      navigate(from ?? (stored?.role === 'admin' ? '/admin' : '/'))
    } else {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 4rem)',
      background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem',
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
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
          <h1 style={{ fontSize: '1.75rem', color: '#1f2937' }}>Bienvenida</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Ingresa a tu cuenta</p>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={14} style={{ display: 'inline', marginRight: 4 }} />
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', marginRight: 4 }} />
              Contraseña
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            Ingresar
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: '#db2777', fontWeight: 600 }}>Regístrate gratis</Link>
        </p>

        <div style={{
          marginTop: '1.5rem', padding: '1rem',
          background: '#f9fafb', borderRadius: '0.5rem',
          fontSize: '0.75rem', color: '#9ca3af',
        }}>
          <strong style={{ color: '#6b7280' }}>Demo:</strong><br />
          Admin: admin@nailstudio.com / admin123<br />
          Cliente: maria@ejemplo.com / 123456
        </div>
      </div>
    </div>
  )
}
