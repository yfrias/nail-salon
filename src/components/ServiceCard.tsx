import { Clock, DollarSign } from 'lucide-react'
import type { Service } from '../types'

interface Props {
  service: Service
  onBook?: (service: Service) => void
  compact?: boolean
}

export default function ServiceCard({ service, onBook, compact }: Props) {
  return (
    <div className="card fade-in" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgb(236 72 153 / 0.15)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = ''
      }}
    >
      <div style={{ position: 'relative', height: compact ? 160 : 220, overflow: 'hidden' }}>
        <img
          src={service.image}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/fce7f3/db2777?text=${encodeURIComponent(service.name)}`
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
        }} />
        <span style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          background: 'linear-gradient(135deg, #ec4899, #a855f7)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {service.category}
        </span>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: compact ? '1rem' : '1.15rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.375rem' }}>
          {service.name}
        </h3>
        {!compact && (
          <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1rem' }}>
            {service.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: compact ? '0.75rem' : 0 }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#6b7280' }}>
              <Clock size={13} />
              {service.duration} min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: 700, color: '#be185d' }}>
              <DollarSign size={15} />
              {service.price}
            </span>
          </div>
          {onBook && (
            <button onClick={() => onBook(service)} className="btn btn-primary btn-sm">
              Agendar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
