import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
<<<<<<< HEAD
import { useAppData } from '../../state/AppDataContext';
=======
>>>>>>> main
import { ContactForm } from './ContactForm';
import { ContactsTable } from './ContactsTable';
import { CSVImportModal } from './CSVImportModal';

<<<<<<< HEAD
export function ContactsPage() {
  const { contacts, groups, addContact, importContacts } = useAppData();
=======
interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
>>>>>>> main
  const [showAdd, setShowAdd] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  return (
    <div>
      <PageHeader title="Contacts" subtitle="Manage families, teachers, and email addresses." />
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Button onClick={() => setShowAdd(true)}>Add Contact</Button>
        <Button variant="secondary" onClick={() => setShowCSV(true)}>
          Import CSV
        </Button>
      </div>
<<<<<<< HEAD
      <ContactsTable contacts={contacts} groups={groups} />

      <Modal open={showAdd} title="Add Contact" onClose={() => setShowAdd(false)}>
        <ContactForm
          groups={groups}
          onSubmit={(payload) => {
            addContact(payload);
=======
      <ContactsTable contacts={contacts} />

      <Modal open={showAdd} title="Add Contact" onClose={() => setShowAdd(false)}>
        <ContactForm
          onSubmit={(payload) => {
            setContacts((current) => [...current, { id: crypto.randomUUID(), ...payload }]);
>>>>>>> main
            setShowAdd(false);
          }}
        />
      </Modal>

      <CSVImportModal
        open={showCSV}
<<<<<<< HEAD
        groups={groups}
        onClose={() => setShowCSV(false)}
        onImport={(rows, groupId) => importContacts(rows, groupId)}
=======
        onClose={() => setShowCSV(false)}
        onImport={(rows) =>
          setContacts((current) => [
            ...current,
            ...rows.map((row) => ({
              id: crypto.randomUUID(),
              firstName: row.firstName,
              lastName: row.lastName,
              email: row.email
            }))
          ])
        }
>>>>>>> main
      />
    </div>
  );
}
