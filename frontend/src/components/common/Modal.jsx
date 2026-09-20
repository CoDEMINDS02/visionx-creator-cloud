import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: 20 }}>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>{footer}</div>}
      </div>
    </div>
  );
}
