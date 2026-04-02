import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { SearchInput } from "../../components/ui/SearchInput";
import { ContactItem, useAppData } from "../../state/AppDataContext";
import { CSVImportModal } from "./CSVImportModal";
import { ContactForm } from "./ContactForm";
import { ContactsView } from "./ContactsView";

export function ContactsPage() {
  const { contacts, groups, addContact, importContacts, updateContact, deleteContact } =
    useAppData();

  const [showAdd, setShowAdd] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactItem | null>(null);

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

      <div style={{ marginBottom: "0.75rem" }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name..."
        />
      </div>

      <ContactsView
        contacts={contacts}
        groups={groups}
        search={search}
        onEdit={setEditingContact}
        onDelete={setDeletingContact}
      />

      {/* Add Contact */}
      <Modal open={showAdd} title="Add Contact" onClose={() => setShowAdd(false)}>
        <ContactForm
          groups={groups}
          onSubmit={(payload) => {
            addContact(payload);
            setShowAdd(false);
          }}
        />
      </Modal>

      {/* Edit Contact */}
      <Modal
        open={editingContact !== null}
        title="Edit Contact"
        onClose={() => setEditingContact(null)}
      >
        {editingContact && (
          <ContactForm
            groups={groups}
            initialValues={{
              firstName: editingContact.firstName,
              lastName: editingContact.lastName,
              email: editingContact.email,
              groupIds: editingContact.groupIds,
            }}
            onSubmit={(payload) => {
              updateContact(editingContact.id, payload);
              setEditingContact(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={deletingContact !== null}
        title="Delete Contact"
        onClose={() => setDeletingContact(null)}
      >
        {deletingContact && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <p style={{ margin: 0 }}>
              Are you sure you want to delete{" "}
              <strong>
                {deletingContact.firstName} {deletingContact.lastName}
              </strong>
              ? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button variant="secondary" onClick={() => setDeletingContact(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteContact(deletingContact.id);
                  setDeletingContact(null);
                }}
                style={{ background: "#dc2626", borderColor: "#dc2626" }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
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
