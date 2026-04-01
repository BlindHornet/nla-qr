import { EmptyState } from '../../components/ui/EmptyState';

export function QRCodesTable() {
  return (
    <EmptyState
      title="No QR codes yet"
      description="Create your first QR code by selecting a contact and expiration date."
    />
  );
}
