import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button {...props} className={`btn ${variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}`}>
      {children}
    </button>
  );
}
