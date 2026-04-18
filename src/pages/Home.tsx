import { Link } from 'react-router-dom'
import { Sparkles, Star, Clock, Shield, ArrowRight } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { useApp } from '../contexts/AppContext'

export default function Home() {
  const { services } = useApp()
  const featured = services.filter(s => s.active).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #f0e7ff 50%, #fce7f3 100%)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgb(236 72 153 / 0.15), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: 350, height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgb(168 85 247 / 0.1), transparent)',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'white',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#be185d',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 12px rgb(236 72 153 / 0.2)',
          }}>
            <Sparkles size={14} />
            Belleza profesional en tus manos
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 700,
            color: '#1f2937',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}>
            Tu salón de uñas<br />
            <span style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              de confianza
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#6b7280', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Manicuras, pedicuras, uñas acrílicas, gel y diseños únicos. Agenda tu cita fácilmente y luce unas uñas perfectas.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/servicios" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              Ver Servicios
            </Link>
            <Link to="/registro" className="btn btn-secondary btn-lg">
              Agendar Cita
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3.5rem', flexWrap: 'wrap',
          }}>
            {[
              { value: '500+', label: 'Clientes felices' },
              { value: '8', label: 'Servicios disponibles' },
              { value: '5★', label: 'Calificación' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#be185d', fontFamily: 'Playfair Display, serif' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Star, title: 'Calidad Premium', desc: 'Productos de primera calidad para resultados duraderos y brillantes.' },
              { icon: Clock, title: 'Citas Online 24/7', desc: 'Agenda tu cita cuando quieras, sin llamadas ni esperas.' },
              { icon: Shield, title: 'Higiene Total', desc: 'Instrumentos esterilizados y ambiente 100% seguro.' },
              { icon: Sparkles, title: 'Diseños Únicos', desc: 'Arte personalizado creado especialmente para ti.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                borderRadius: '1rem',
                border: '2px solid #fce7f3',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 56, height: 56,
                  background: 'linear-gradient(135deg, #fce7f3, #f3e8ff)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Icon size={24} color="#db2777" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1f2937' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section style={{ padding: '4rem 1.5rem', background: '#fdf2f8' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '0.75rem' }}>Servicios Destacados</h2>
            <p style={{ color: '#6b7280' }}>Los favoritos de nuestras clientas</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {featured.map(s => (
              <ServiceCard key={s.id} service={s} onBook={() => window.location.href = '/servicios'} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/servicios" className="btn btn-primary">
              Ver todos los servicios
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #be185d, #7c3aed)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>
            ¿Lista para lucir unas uñas perfectas?
          </h2>
          <p style={{ color: 'rgb(255 255 255 / 0.8)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Crea tu cuenta gratis y agenda tu primera cita hoy.
          </p>
          <Link to="/registro" className="btn btn-lg" style={{
            background: 'white',
            color: '#be185d',
            fontWeight: 600,
          }}>
            <Sparkles size={18} />
            Comenzar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: '#9ca3af',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        fontSize: '0.875rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={16} color="#f9a8d4" />
          <span style={{ color: '#f9a8d4', fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>Nail Studio</span>
        </div>
        <p>© {new Date().getFullYear()} Nail Studio. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
