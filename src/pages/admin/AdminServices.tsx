import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, X, Check } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import type { Service } from '../../types'

const CATEGORIES = ['Manicura', 'Gel', 'Acrílico', 'Arte', 'Pedicura', 'Spa', 'Mantenimiento']

const empty: Omit<Service, 'id'> = {
  name: '', description: '', price: 0, duration: 30, category: 'Manicura', image: '', active: true,
}

export default function AdminServices() {
  const { services, addService, updateService, deleteService } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<Omit<Service, 'id'>>(empty)
  const [imagePreview, setImagePreview] = useState('')

  function set(k: keyof typeof form, v: string | number | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleImageFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      setImagePreview(url)
      set('image', url)
    }
    reader.readAsDataURL(file)
  }

  function openAdd() {
    setEditing(null)
    setForm(empty)
    setImagePreview('')
    setShowForm(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, image: s.image, active: s.active })
    setImagePreview(s.image)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) await updateService(editing.id, form)
    else await addService(form)
    setShowForm(false)
  }

  async function handleDelete(s: Service) {
    if (confirm(`¿Eliminar "${s.name}"?`)) await deleteService(s.id)
  }

  return (
    <div>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #fdf2f8, #f0e7ff)' }}>
        <h1>Gestión de Servicios</h1>
        <p>Agrega, edita y administra los servicios del salón</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={openAdd} className="btn btn-primary">
            <Plus size={16} />
            Nuevo servicio
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem',
          }}>
            <div className="card" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #fce7f3',
                position: 'sticky', top: 0, background: 'white', zIndex: 1,
              }}>
                <h2 style={{ fontSize: '1.15rem', color: '#1f2937' }}>
                  {editing ? 'Editar servicio' : 'Nuevo servicio'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#9ca3af' }}>
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Nombre del servicio</label>
                    <input className="form-input" placeholder="Manicura Clásica" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select className="form-input" value={form.active ? 'active' : 'inactive'} onChange={e => set('active', e.target.value === 'active')}>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio ($)</label>
                    <input type="number" className="form-input" min="0" step="0.01" value={form.price} onChange={e => set('price', parseFloat(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duración (min)</label>
                    <input type="number" className="form-input" min="15" step="15" value={form.duration} onChange={e => set('duration', parseInt(e.target.value))} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Descripción</label>
                    <textarea className="form-input" rows={3} placeholder="Describe el servicio..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} required />
                  </div>
                </div>

                {/* Image section */}
                <div className="form-group">
                  <label className="form-label"><Image size={13} style={{ display: 'inline', marginRight: 4 }} />Imagen del servicio</label>

                  {imagePreview && (
                    <div style={{ marginBottom: '0.75rem', borderRadius: '0.75rem', overflow: 'hidden', height: 180, position: 'relative' }}>
                      <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/fce7f3/db2777?text=Sin+imagen' }} />
                      <button type="button" onClick={() => { setImagePreview(''); set('image', '') }}
                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      border: '2px dashed #fbcfe8',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      color: '#db2777',
                      fontSize: '0.875rem',
                      justifyContent: 'center',
                    }}>
                      <Image size={16} />
                      Subir imagen desde dispositivo
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
                    </label>
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>o pega una URL</div>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://... (URL de imagen)"
                      value={!imagePreview.startsWith('data:') ? form.image : ''}
                      onChange={e => { set('image', e.target.value); setImagePreview(e.target.value) }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={16} />
                    {editing ? 'Guardar cambios' : 'Crear servicio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {services.map(s => (
            <div key={s.id} className="card" style={{ opacity: s.active ? 1 : 0.6 }}>
              <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/600x400/fce7f3/db2777?text=${encodeURIComponent(s.name)}` }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                {!s.active && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em',
                  }}>
                    INACTIVO
                  </div>
                )}
                <span style={{
                  position: 'absolute', bottom: '0.75rem', left: '0.75rem',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  color: 'white', padding: '0.2rem 0.625rem',
                  borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                  textTransform: 'uppercase',
                }}>{s.category}</span>
              </div>

              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', color: '#1f2937' }}>{s.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {s.description.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#be185d' }}>${s.price} · {s.duration}min</span>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button
                      onClick={() => updateService(s.id, { active: !s.active })}
                      className="btn btn-sm"
                      style={{ background: '#f3f4f6', border: 'none', color: '#6b7280', padding: '0.375rem' }}
                      title={s.active ? 'Desactivar' : 'Activar'}
                    >
                      {s.active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => openEdit(s)} className="btn btn-sm" style={{ background: '#ede9fe', border: 'none', color: '#7c3aed', padding: '0.375rem' }}>
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(s)} className="btn btn-sm" style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '0.375rem' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
