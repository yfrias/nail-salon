import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Menu, X, LogOut, User, Calendar, LayoutDashboard, Users, Settings } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Navbar() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const isAdmin = currentUser?.role === 'admin'

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/clientes', label: 'Clientes', icon: Users },
        { to: '/admin/servicios', label: 'Servicios', icon: Sparkles },
        { to: '/admin/citas', label: 'Citas', icon: Calendar },
      ]
    : [
        { to: '/servicios', label: 'Servicios', icon: Sparkles },
        ...(currentUser ? [
          { to: '/mis-citas', label: 'Mis Citas', icon: Calendar },
          { to: '/mi-cuenta', label: 'Mi Cuenta', icon: Settings },
        ] : []),
      ]

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 20px rgb(236 72 153 / 0.12)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            borderRadius: '50%',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.25rem', color: '#be185d' }}>
            Nail Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: location.pathname === to ? '#db2777' : '#6b7280',
                background: location.pathname === to ? '#fce7f3' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </Link>
          ))}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 0.875rem',
                background: '#fdf2f8',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                color: '#be185d',
                fontWeight: 500,
              }}>
                <User size={14} />
                {currentUser.name.split(' ')[0]}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <LogOut size={14} />
                Salir
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{ background: 'none', border: 'none', color: '#6b7280', display: 'none' }}
          className="mobile-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #fce7f3',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: location.pathname === to ? '#db2777' : '#374151',
                background: location.pathname === to ? '#fce7f3' : 'transparent',
                fontWeight: 500,
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          {currentUser ? (
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: 'none', border: 'none',
              color: '#dc2626', fontWeight: 500, fontSize: '0.875rem',
            }}>
              <LogOut size={18} />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center' }}>Ingresar</Link>
              <Link to="/registro" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center' }}>Registrarse</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
