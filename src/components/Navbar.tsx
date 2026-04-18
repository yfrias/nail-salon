import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Menu, X, LogOut, Calendar, LayoutDashboard, Users, ChevronDown, UserCircle, KeyRound, ShieldCheck } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Navbar() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
    setMobileOpen(false)
    setDropdownOpen(false)
  }

  const isAdmin = currentUser?.role === 'admin'
  const initials = currentUser?.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? ''

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/clientes', label: 'Clientes', icon: Users },
        { to: '/admin/servicios', label: 'Servicios', icon: Sparkles },
        { to: '/admin/citas', label: 'Citas', icon: Calendar },
      ]
    : [
        { to: '/servicios', label: 'Servicios', icon: Sparkles },
        ...(currentUser ? [{ to: '/mis-citas', label: 'Mis Citas', icon: Calendar }] : []),
      ]

  return (
    <nav style={{ background: 'white', boxShadow: '0 2px 20px rgb(236 72 153 / 0.12)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.25rem', color: '#be185d' }}>Nail Studio</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500,
              color: location.pathname === to ? '#db2777' : '#6b7280',
              background: location.pathname === to ? '#fce7f3' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {label}
            </Link>
          ))}

          {currentUser ? (
            <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '0.5rem' }}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.375rem 0.75rem 0.375rem 0.5rem',
                  background: '#fdf2f8', borderRadius: '9999px',
                  border: '2px solid #fce7f3', cursor: 'pointer',
                  fontSize: '0.8rem', color: '#be185d', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#ec4899,#a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span>{currentUser.name.split(' ')[0]}</span>
                <span style={{
                  fontSize: '0.65rem', background: isAdmin ? '#ede9fe' : '#fce7f3',
                  color: isAdmin ? '#7c3aed' : '#db2777',
                  padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 600,
                }}>
                  {isAdmin ? 'Admin' : 'Cliente'}
                </span>
                <ChevronDown size={13} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'white', borderRadius: '0.75rem', minWidth: 220,
                  boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)',
                  border: '1px solid #fce7f3', overflow: 'hidden', zIndex: 200,
                }}>
                  {/* Header */}
                  <div style={{ padding: '1rem', background: 'linear-gradient(135deg,#fdf2f8,#f0e7ff)', borderBottom: '1px solid #fce7f3' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.15rem' }}>{currentUser.email}</div>
                  </div>
                  {/* Options */}
                  <div style={{ padding: '0.375rem' }}>
                    <Link to="/mi-cuenta" onClick={() => setDropdownOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                      color: '#374151', fontSize: '0.875rem', fontWeight: 500,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fdf2f8')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <UserCircle size={16} color="#a855f7" />
                      Datos personales
                    </Link>
                    <Link to="/mi-cuenta?tab=password" onClick={() => setDropdownOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                      color: '#374151', fontSize: '0.875rem', fontWeight: 500,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fdf2f8')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <KeyRound size={16} color="#ec4899" />
                      Cambiar contraseña
                    </Link>
                    {isAdmin && (
                      <Link to="/admin/clientes?tab=admins" onClick={() => setDropdownOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                        color: '#374151', fontSize: '0.875rem', fontWeight: 500,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fdf2f8')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <ShieldCheck size={16} color="#6366f1" />
                        Administradores
                      </Link>
                    )}
                    <div style={{ height: 1, background: '#fce7f3', margin: '0.375rem 0' }} />
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                      background: 'none', border: 'none', width: '100%',
                      color: '#dc2626', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'none' }} className="mobile-toggle">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #fce7f3', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '0.5rem',
              color: location.pathname === to ? '#db2777' : '#374151',
              background: location.pathname === to ? '#fce7f3' : 'transparent', fontWeight: 500,
            }}>
              <Icon size={18} />{label}
            </Link>
          ))}
          {currentUser && (
            <>
              <Link to="/mi-cuenta" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#374151', fontWeight: 500 }}>
                <UserCircle size={18} />Datos personales
              </Link>
              <Link to="/mi-cuenta?tab=password" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#374151', fontWeight: 500 }}>
                <KeyRound size={18} />Cambiar contraseña
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'none', border: 'none', color: '#dc2626', fontWeight: 500, fontSize: '0.875rem' }}>
                <LogOut size={18} />Cerrar sesión
              </button>
            </>
          )}
          {!currentUser && (
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
