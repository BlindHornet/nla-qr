# Contacts Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain contacts table with a collapsible group view, single-box search, edit modal, and delete confirmation.

**Architecture:** Add `updateContact`/`deleteContact` mutations to `AppDataContext`, delete `ContactsTable`, create `ContactsView` for the collapsible group layout, extend `ContactForm` to support edit mode, and wire everything together in `ContactsPage`.

**Tech Stack:** React 18, TypeScript (strict), Firebase Firestore, Vite

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/state/AppDataContext.tsx` | Add `updateContact` and `deleteContact` mutations |
| Delete | `src/features/contacts/ContactsTable.tsx` | Replaced by ContactsView |
| Create | `src/features/contacts/ContactsView.tsx` | Collapsible group sections + search filtering + row actions |
| Modify | `src/features/contacts/ContactForm.tsx` | Add edit mode via optional `initialValues` / `contactId` props |
| Modify | `src/features/contacts/ContactsPage.tsx` | Add search state, edit/delete modal state, wire ContactsView |

---

### Task 1: Add `updateContact` and `deleteContact` to AppDataContext

**Files:**
- Modify: `src/state/AppDataContext.tsx`

- [ ] **Step 1: Add the two method signatures to the interface**

Open `src/state/AppDataContext.tsx`. In `AppDataContextValue` (line 40), add after `updateContactGroups`:

```ts
updateContact: (id: string, payload: { firstName: string; lastName: string; email: string; groupIds: string[] }) => Promise<void>;
deleteContact: (id: string) => Promise<void>;
```

- [ ] **Step 2: Add the `deleteDoc` import**

At the top of the file, the existing Firestore import is:
```ts
import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
```

Add `deleteDoc` to that import:
```ts
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
```

- [ ] **Step 3: Implement both mutations inside the `useMemo` value object**

After `updateContactGroups` (around line 133), add:

```ts
updateContact: async (id, payload) => {
  await updateDoc(doc(db, 'contacts', id), {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    groupIds: payload.groupIds,
  });
},
deleteContact: async (id) => {
  await deleteDoc(doc(db, 'contacts', id));
},
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/state/AppDataContext.tsx
git commit -m "feat: add updateContact and deleteContact mutations to AppDataContext"
```

---

### Task 2: Create `ContactsView`

**Files:**
- Create: `src/features/contacts/ContactsView.tsx`

- [ ] **Step 1: Create the file with the full implementation**

```tsx
import { useState } from "react";
import { ContactItem, GroupItem } from "../../state/AppDataContext";

interface ContactsViewProps {
  contacts: ContactItem[];
  groups: GroupItem[];
  search: string;
  onEdit: (contact: ContactItem) => void;
  onDelete: (contact: ContactItem) => void;
}

export function ContactsView({
  contacts,
  groups,
  search,
  onEdit,
  onDelete,
}: ContactsViewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!contacts.length) {
    return (
      <div className="page-card">
        No contacts yet. Click <strong>Add Contact</strong> or{" "}
        <strong>Import CSV</strong>.
      </div>
    );
  }

  const q = search.trim().toLowerCase();

  const matches = (contact: ContactItem) =>
    !q ||
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(q);

  const toggleSection = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const sortedGroups = [...groups].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const ungrouped = contacts.filter((c) => c.groupIds.length === 0);

  const sections: Array<{ key: string; label: string; members: ContactItem[] }> =
    sortedGroups.map((g) => ({
      key: g.id,
      label: g.name,
      members: contacts.filter((c) => c.groupIds.includes(g.id)),
    }));

  if (ungrouped.length > 0) {
    sections.push({ key: "__ungrouped__", label: "Ungrouped", members: ungrouped });
  }

  const visibleSections = q
    ? sections.filter((s) => s.members.some(matches))
    : sections;

  if (q && visibleSections.length === 0) {
    return (
      <div className="page-card">No contacts match &ldquo;{search}&rdquo;.</div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {visibleSections.map((section) => {
        const isOpen = !!expanded[section.key];
        const matchingMembers = section.members.filter(matches);
        const countLabel = q
          ? `${matchingMembers.length} / ${section.members.length}`
          : `${section.members.length}`;

        return (
          <div key={section.key} className="page-card" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {isOpen ? "▼" : "▶"}
              </span>
              <span style={{ fontWeight: 600 }}>{section.label}</span>
              <span
                style={{
                  marginLeft: "0.25rem",
                  background: "#e2e8f0",
                  borderRadius: 999,
                  padding: "0.1rem 0.5rem",
                  fontSize: "0.75rem",
                  color: "#475569",
                }}
              >
                {countLabel}
              </span>
            </button>

            {isOpen && (
              <div style={{ borderTop: "1px solid #e2e8f0" }}>
                {matchingMembers.length === 0 ? (
                  <p style={{ padding: "0.75rem 1rem", margin: 0, color: "#64748b" }}>
                    No contacts match &ldquo;{search}&rdquo;.
                  </p>
                ) : (
                  matchingMembers.map((contact) => (
                    <div
                      key={contact.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 1rem",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <span style={{ flex: 1 }}>
                        {contact.firstName} {contact.lastName}
                      </span>
                      <span style={{ flex: 1, color: "#475569", fontSize: "0.9rem" }}>
                        {contact.email}
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                        onClick={() => onEdit(contact)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{
                          padding: "0.25rem 0.6rem",
                          fontSize: "0.8rem",
                          color: "#c00",
                        }}
                        onClick={() => onDelete(contact)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/contacts/ContactsView.tsx
git commit -m "feat: add ContactsView with collapsible group sections and search"
```

---

### Task 3: Extend `ContactForm` to support edit mode

**Files:**
- Modify: `src/features/contacts/ContactForm.tsx`

- [ ] **Step 1: Replace the file contents with the extended version**

```tsx
import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/Button";
import { GroupItem } from "../../state/AppDataContext";

interface ContactFormProps {
  groups: GroupItem[];
  initialValues?: {
    firstName: string;
    lastName: string;
    email: string;
    groupIds: string[];
  };
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    groupIds: string[];
  }) => void;
}

export function ContactForm({ groups, initialValues, onSubmit }: ContactFormProps) {
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? "");
  const [lastName, setLastName] = useState(initialValues?.lastName ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [groupIds, setGroupIds] = useState<string[]>(initialValues?.groupIds ?? []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      groupIds,
    });
  };

  const toggleGroup = (groupId: string) => {
    setGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="page-card" style={{ padding: "0.5rem" }}>
        <strong>Assign to Groups</strong>
        {groups.length ? (
          groups.map((group) => (
            <label
              key={group.id}
              style={{ display: "block", marginTop: "0.35rem" }}
            >
              <input
                type="checkbox"
                checked={groupIds.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
                style={{ width: "auto", marginRight: "0.35rem" }}
              />
              {group.name}
            </label>
          ))
        ) : (
          <p style={{ marginBottom: 0 }}>No groups yet.</p>
        )}
      </div>
      <Button type="submit">{initialValues ? "Save Changes" : "Save Contact"}</Button>
    </form>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/contacts/ContactForm.tsx
git commit -m "feat: extend ContactForm to support edit mode via initialValues prop"
```

---

### Task 4: Rewrite `ContactsPage` and delete `ContactsTable`

**Files:**
- Modify: `src/features/contacts/ContactsPage.tsx`
- Delete: `src/features/contacts/ContactsTable.tsx`

- [ ] **Step 1: Replace `ContactsPage.tsx` with the new version**

```tsx
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
          placeholder="Search by name or group..."
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
```

- [ ] **Step 2: Delete `ContactsTable.tsx`**

```bash
rm src/features/contacts/ContactsTable.tsx
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Smoke-test in browser**

```bash
npm run dev
```

- Open Contacts page
- Verify group sections render collapsed
- Click a group header — it should expand showing contacts
- Type a name in the search box — count badges update, non-matching sections hide
- Click Edit on a contact — modal opens pre-filled
- Change a field, Save Changes — contact updates in the list
- Click Delete on a contact — confirmation modal appears
- Click Delete in the modal — contact disappears
- Click Cancel — nothing happens

- [ ] **Step 5: Lint check**

```bash
npm run lint
```

Expected: no warnings.

- [ ] **Step 6: Commit**

```bash
git add src/features/contacts/ContactsPage.tsx
git rm src/features/contacts/ContactsTable.tsx
git commit -m "feat: redesign contacts page with collapsible groups, search, edit and delete"
```
