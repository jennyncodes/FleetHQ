// components/Utility.tsx
// Reusable utility components

// Toast Notification Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div 
      className={`toast toast-${type}`}
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 1000,
        animation: 'slideInRight 0.3s ease'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>
        {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          color: 'white',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ✕
      </button>
    </div>
  );
}

// Loading Spinner Component
interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-xl)',
      gap: 'var(--spacing-md)'
    }}>
      <div className="loader" style={{
        width: '48px',
        height: '48px',
        border: '4px solid var(--peach-light)',
        borderTop: '4px solid var(--orange-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: 'var(--gray-medium)', margin: 0 }}>{message}</p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon = '📭', 
  title, 
  message, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--spacing-xl)',
      color: 'var(--gray-medium)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--gray-dark)' }}>
        {title}
      </h3>
      <p style={{ marginBottom: 'var(--spacing-lg)' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  index?: number;
}

export function StatCard({ 
  label, 
  value, 
  icon = '📊', 
  color = 'var(--orange-primary)',
  index = 0
}: StatCardProps) {
  return (
    <div 
      className="stat-card stagger-item"
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-sm)'
      }}>
        <span className="stat-label">{label}</span>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

// Confirm Dialog Component
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isOpen
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{
        maxWidth: '400px',
        margin: '1rem',
        animation: 'fadeInUp 0.3s ease'
      }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{title}</h3>
        <p style={{ color: 'var(--gray-medium)', marginBottom: 'var(--spacing-lg)' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button className="btn btn-primary" onClick={onConfirm} style={{ flex: 1 }}>
            {confirmLabel}
          </button>
          <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Badge Component
interface BadgeProps {
  label: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ label, type = 'info' }: BadgeProps) {
  const colors = {
    success: { bg: '#E8F5E9', color: '#2E7D32' },
    warning: { bg: '#FFF3E0', color: '#E65100' },
    error: { bg: '#FFEBEE', color: '#C62828' },
    info: { bg: '#E3F2FD', color: '#1565C0' }
  };

  const { bg, color } = colors[type];

  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.875rem',
      fontWeight: 600,
      background: bg,
      color: color
    }}>
      {label}
    </span>
  );
}