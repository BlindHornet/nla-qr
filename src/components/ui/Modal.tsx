import { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
}

export function Modal({ open, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="page-card" role="dialog" aria-modal="true" aria-label={title}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
