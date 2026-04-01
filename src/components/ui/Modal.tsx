import { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose?: () => void;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="page-card modal-card" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {onClose ? (
            <button className="btn btn-secondary" onClick={onClose} type="button">
              Close
            </button>
          ) : null}
        </div>
        <div style={{ marginTop: '0.75rem' }}>{children}</div>
      </div>
    </div>
  );
}
