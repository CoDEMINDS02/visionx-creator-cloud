import { useContext } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const ICONS = { success: CheckCircle2, error: AlertCircle, default: Info };

export default function ToastStack() {
  const { toasts, dismissToast } = useContext(AppContext);

  return (
    <div className="toast-stack">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant] || ICONS.default;
        return (
          <div
            key={toast.id}
            className={`toast ${toast.variant === 'error' ? 'toast-error' : ''} ${toast.variant === 'success' ? 'toast-success' : ''}`}
            onClick={() => dismissToast(toast.id)}
            role="status"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
