import { useState, useEffect } from 'react'
import { Settings, Clock, Calendar, CheckCircle } from 'lucide-react'
import { api } from '../../lib/api'
import type { AvailabilityConfig } from '../../types'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
const INTERVAL_OPTIONS = [15, 20, 30, 45, 60, 90, 120]

function toggle(csv: string, value: number): string {
  const arr = csv.split(',').map(Number).filter(n => !isNaN(n))
  return arr.includes(value)
    ? arr.filter(n => n !== value).join(',')
    : [...arr, value].sort((a, b) => a - b).join(',')
}

function includes(csv: string, value: number): boolean {
  return csv.split(',').map(Number).includes(value)
}

function generatePreview(start: string, end: string, interval: number): string[] {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const slots: string[] = []
  let cur = sh * 60 + sm
  const endMin = eh * 60 + em
  while (cur <= endMin) {
    slots.push(`${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`)
    cur += interval
  }
  return slots
}

export default function AdminAvailability() {
  const [config, setConfig] = useState<AvailabilityConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.availability.get().then(setConfig)
  }, [])

  async function handleSave() {
    if (!config) return
    setSaving(true)
    setSaved(false)
    try {
      const updated = await api.availability.update({
        activeMonths: config.activeMonths,
        activeDays: config.activeDays,
        timeStart: config.timeStart,
        timeEnd: config.timeEnd,
        intervalMin: config.intervalMin,
      })
      setConfig(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (!config) return <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>Cargando...</div>

  const preview = generatePreview(config.timeStart, config.timeEnd, config.intervalMin)

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontFamily: 'Playfair Display, serif', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings size={28} color="#a855f7" /> Disponibilidad
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Configura los días y horarios en que ofreces citas.</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>

        {/* Active days */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#ec4899" /> Días disponibles
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {DAY_NAMES.map((name, i) => {
              const active = includes(config.activeDays, i)
              return (
                <button
                  key={i}
                  onClick={() => setConfig(c => c ? { ...c, activeDays: toggle(c.activeDays, i) } : c)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: active ? 'linear-gradient(135deg, #ec4899, #a855f7)' : '#f3f4f6',
                    color: active ? 'white' : '#6b7280',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: 56,
                  }}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active months */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#a855f7" /> Meses activos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {MONTH_NAMES.map((name, i) => {
              const active = includes(config.activeMonths, i)
              return (
                <button
                  key={i}
                  onClick={() => setConfig(c => c ? { ...c, activeMonths: toggle(c.activeMonths, i) } : c)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '2px solid',
                    borderColor: active ? '#a855f7' : '#e5e7eb',
                    background: active ? '#f5f3ff' : 'white',
                    color: active ? '#7c3aed' : '#6b7280',
                    fontWeight: active ? 700 : 400,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time settings */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#ec4899" /> Horario de atención
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Hora inicio</label>
              <input
                type="time"
                className="form-input"
                value={config.timeStart}
                onChange={e => setConfig(c => c ? { ...c, timeStart: e.target.value } : c)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hora fin</label>
              <input
                type="time"
                className="form-input"
                value={config.timeEnd}
                onChange={e => setConfig(c => c ? { ...c, timeEnd: e.target.value } : c)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Intervalo</label>
              <select
                className="form-input"
                value={config.intervalMin}
                onChange={e => setConfig(c => c ? { ...c, intervalMin: Number(e.target.value) } : c)}
              >
                {INTERVAL_OPTIONS.map(v => (
                  <option key={v} value={v}>
                    {v < 60 ? `${v} min` : `${v / 60}h`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time slot preview */}
          <div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem', fontWeight: 600 }}>
              Vista previa — {preview.length} horarios generados:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {preview.map(t => (
                <span key={t} style={{
                  padding: '0.25rem 0.625rem',
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#065f46', fontSize: '0.875rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> Guardado correctamente
            </span>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
