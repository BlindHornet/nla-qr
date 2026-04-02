import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useAppData } from "../../state/AppDataContext";
import { ContactForm } from "./ContactForm";
import { ContactsTable } from "./ContactsTable";
import { CSVImportModal } from "./CSVImportModal";

export function ContactsPage() {
  const { contacts, groups, addContact, importContacts } = useAppData();
  const [showAdd, setShowAdd] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Manage families, teachers, and email addresses."
      />
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <Button onClick={() => setShowAdd(true)}>Add Contact</Button>
        <Button variant="secondary" onClick={() => setShowCSV(true)}>
          Import CSV
        </Button>
      </div>
      <ContactsTable contacts={contacts} groups={groups} />

      <Modal
        open={showAdd}
        title="Add Contact"
        onClose={() => setShowAdd(false)}
      >
        <ContactForm
          groups={groups}
          onSubmit={(payload) => {
            addContact(payload);
            setShowAdd(false);
          }}
        />
      </Modal>

      <CSVImportModal
        open={showCSV}
        groups={groups}
        onClose={() => setShowCSV(false)}
        onImport={(rows, groupId) => importContacts(rows, groupId)}
      />
    </div>
  );
}
