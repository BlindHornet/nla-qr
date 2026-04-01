import { PageHeader } from '../../components/layout/PageHeader';
import { GmailAuthSection } from './GmailAuthSection';
import { BrandingSection } from './BrandingSection';

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Connect Gmail and configure app branding." />
      <GmailAuthSection />
      <BrandingSection />
    </div>
  );
}
