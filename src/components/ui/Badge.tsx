import { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
  return (
    <span
      style={{
        padding: '0.2rem 0.5rem',
        borderRadius: 999,
        background: '#e0f2fe',
        color: '#0369a1',
        fontSize: 12,
        fontWeight: 700
      }}
    >
      {children}
    </span>
  );
}
