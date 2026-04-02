import { Badge } from '../../components/ui/Badge';

export function QRCodesStats() {
  return (
    <div className="page-card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Stats</h3>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Badge>Total: 0</Badge>
        <Badge>Active: 0</Badge>
        <Badge>Expired: 0</Badge>
      </div>
    </div>
  );
}
