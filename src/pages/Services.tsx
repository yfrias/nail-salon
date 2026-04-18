import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { useApp } from '../contexts/AppContext'
import type { Service } from '../types'

const CATEGORIES = ['Todos', 'Manicura', 'Gel', 'Acrílico', 'Arte', 'Pedicura', 'Spa', 'Mantenimiento']

export default function Services() {
  const { services, currentUser } = useApp()
  const navigate = useNavigate()
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const active = services.filter(s => s.active)
  const filtered = active.filter(s => {
    const matchCat = category === 'Todos' || s.category === category
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handleBook(service: Service) {
    if (!currentUser) {
      navigate('/login')
      return
    }
    navigate(`/agendar/${service.id}`)
  }

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Nuestros Servicios</h1>
        <p>Encuentra el servicio perfecto para ti y agenda tu cita</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: 200, maxWidth: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
              placeholder="Buscar servicio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="btn btn-sm"
                style={{
                  background: category === cat ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'white',
                  color: category === cat ? 'white' : '#6b7280',
                  border: category === cat ? 'none' : '2px solid #e5e7eb',
                  boxShadow: category === cat ? '0 4px 14px rgb(236 72 153 / 0.4)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No se encontraron servicios</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(s => (
              <ServiceCard key={s.id} service={s} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
