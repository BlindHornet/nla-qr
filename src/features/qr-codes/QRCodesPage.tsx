import { PageHeader } from '../../components/layout/PageHeader';
import { QRCodesStats } from './QRCodesStats';
import { QRCodesTable } from './QRCodesTable';

export function QRCodesPage() {
  return (
    <div>
      <PageHeader
        title="QR Codes"
        subtitle="Generate, track, and manage active and expired family QR codes."
      />
      <QRCodesStats />
      <QRCodesTable />
    </div>
  );
}
