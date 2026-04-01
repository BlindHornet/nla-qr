import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

export function SendEmailPage() {
  return (
    <div>
      <PageHeader title="Send Email" subtitle="Compose QR emails for individuals or groups." />
      <EmptyState
        title="Compose experience coming next"
        description="Group mode and individual mode panels will be added in the next iteration."
      />
    </div>
  );
}
