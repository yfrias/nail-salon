import { AlertTriangle } from 'lucide-react'

interface Props {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmModal({
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Sí, confirmar',
  cancelLabel = 'No, volver',
  onConfirm,
  onCancel,
  danger = true,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgb(0 0 0 / 0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '2rem',
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 20px 60px rgb(0 0 0 / 0.2)',
          animation: 'modalIn 0.2s ease',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%', margin: '0 auto 1.25rem',
          background: danger ? '#fee2e2' : '#fef3c7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={28} color={danger ? '#dc2626' : '#d97706'} />
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            style={{ flex: 1, maxWidth: 160 }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              flex: 1, maxWidth: 160,
              background: danger ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white', border: 'none',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  )
}
