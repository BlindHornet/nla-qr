interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header style={{ marginBottom: '1rem' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{title}</h2>
      {subtitle ? <p style={{ margin: 0, color: '#64748b' }}>{subtitle}</p> : null}
    </header>
  );
}
