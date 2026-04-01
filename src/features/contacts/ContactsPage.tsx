import { PageHeader } from '../../components/layout/PageHeader';
import { ContactsTable } from './ContactsTable';

export function ContactsPage() {
  return (
    <div>
      <PageHeader title="Contacts" subtitle="Manage families, teachers, and email addresses." />
      <ContactsTable />
    </div>
  );
}
