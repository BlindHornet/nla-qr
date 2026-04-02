# Groups CRUD + Expiration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add create/edit/delete to the Groups page with an optional expiration date; expired groups display faded and are hidden from the Send Email recipient selector.

**Architecture:** Extend `GroupItem` with `expiresAt`, add `updateGroup`/`deleteGroup` to `AppDataContext`, replace `NewGroupModal` with a unified `GroupFormModal`, update cards in `GroupsGrid` to show expiration and action buttons, and filter expired groups before passing them to `GroupRecipientPanel`.

**Tech Stack:** React 18, TypeScript, Vite, no test framework (use `npx tsc --noEmit` for type-checking)

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/state/AppDataContext.tsx` |
| Modify | `src/hooks/useGroups.ts` |
| Create | `src/features/groups/GroupFormModal.tsx` |
| Delete | `src/features/groups/NewGroupModal.tsx` (replaced by GroupFormModal) |
| Modify | `src/features/groups/GroupsGrid.tsx` |
| Modify | `src/features/groups/GroupsPage.tsx` |
| Modify | `src/features/send-email/SendEmailPage.tsx` |

---

### Task 1: Extend `GroupItem` and add `updateGroup`/`deleteGroup` to AppDataContext

**Files:**
- Modify: `src/state/AppDataContext.tsx`

- [ ] **Step 1: Add `expiresAt` to `GroupItem` and the two new action signatures**

  In `src/state/AppDataContext.tsx`, replace the `GroupItem` interface and `AppDataContextValue` interface:

  ```ts
  export interface GroupItem {
    id: string;
    name: string;
    description: string;
    expiresAt?: string; // ISO date string e.g. "2026-06-01"
  }
  ```

  In `AppDataContextValue`, add after `addGroup`:

  ```ts
  updateGroup: (id: string, payload: { name: string; description: string; expiresAt?: string }) => void;
  deleteGroup: (id: string) => void;
  ```

- [ ] **Step 2: Implement `updateGroup` and `deleteGroup` inside the `useMemo` value**

  Inside the `useMemo` block in `AppDataProvider`, add after `addGroup`:

  ```ts
  updateGroup: (id, payload) => {
    setGroups((current) =>
      current.map((group) => (group.id === id ? { ...group, ...payload } : group))
    );
  },
  deleteGroup: (id) => {
    setGroups((current) => current.filter((group) => group.id !== id));
    setContacts((current) =>
      current.map((contact) => ({
        ...contact,
        groupIds: contact.groupIds.filter((gid) => gid !== id),
      }))
    );
  },
  ```

- [ ] **Step 3: Verify types compile**

  ```bash
  cd f:/Coding/Active/nla-qr/nla-qr && npx tsc --noEmit
  ```

  Expected: no errors (there will be errors about `useGroups` and `GroupsPage` still using old API — those are resolved in later tasks; confirm the AppDataContext file itself is error-free by checking the errors are only in consuming files).

- [ ] **Step 4: Commit**

  ```bash
  git add src/state/AppDataContext.tsx
  git commit -m "feat: add expiresAt to GroupItem, updateGroup and deleteGroup to context"
  ```

---

### Task 2: Update `useGroups` hook

**Files:**
- Modify: `src/hooks/useGroups.ts`

- [ ] **Step 1: Expose `updateGroup` and `deleteGroup`**

  Replace the entire file contents:

  ```ts
  import { useAppData } from "../state/AppDataContext";

  export function useGroups() {
    const { groups, addGroup, updateGroup, deleteGroup } = useAppData();
    return {
      groups,
      loading: false,
      addGroup,
      updateGroup,
      deleteGroup,
    };
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/hooks/useGroups.ts
  git commit -m "feat: expose updateGroup and deleteGroup from useGroups hook"
  ```

---

### Task 3: Create `GroupFormModal` (replaces `NewGroupModal`)

**Files:**
- Create: `src/features/groups/GroupFormModal.tsx`
- Delete: `src/features/groups/NewGroupModal.tsx`

- [ ] **Step 1: Create `GroupFormModal.tsx`**

  Create `src/features/groups/GroupFormModal.tsx` with this content:

  ```tsx
  import { FormEvent, useEffect, useState } from 'react';
  import { Button } from '../../components/ui/Button';
  import { Modal } from '../../components/ui/Modal';

  interface GroupFormValues {
    name: string;
    description: string;
    expiresAt?: string;
  }

  interface GroupFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: GroupFormValues) => void;
    onDelete?: () => void;
    initialValues?: GroupFormValues;
  }

  export function GroupFormModal({
    open,
    onClose,
    onSubmit,
    onDelete,
    initialValues,
  }: GroupFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    useEffect(() => {
      if (open) {
        setName(initialValues?.name ?? '');
        setDescription(initialValues?.description ?? '');
        setExpiresAt(initialValues?.expiresAt ?? '');
      }
    }, [open, initialValues]);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (!name.trim()) return;
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        expiresAt: expiresAt || undefined,
      });
      onClose();
    };

    const title = initialValues ? 'Edit Group' : 'Add Group';

    return (
      <Modal open={open} title={title} onClose={onClose}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.6rem' }}>
          <input
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <label style={{ display: 'grid', gap: '0.25rem', fontSize: '0.875rem' }}>
            Expiration date (optional)
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.25rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button type="submit">Save Group</Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
            {onDelete && (
              <Button
                type="button"
                variant="secondary"
                onClick={onDelete}
                style={{ color: '#dc2626' }}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </Modal>
    );
  }
  ```

- [ ] **Step 2: Delete `NewGroupModal.tsx`**

  ```bash
  rm src/features/groups/NewGroupModal.tsx
  ```

- [ ] **Step 3: Verify types compile**

  ```bash
  npx tsc --noEmit
  ```

  Expected: errors about `GroupsPage` still importing `NewGroupModal` — that is resolved in Task 5.

- [ ] **Step 4: Commit**

  ```bash
  git add src/features/groups/GroupFormModal.tsx src/features/groups/NewGroupModal.tsx
  git commit -m "feat: add GroupFormModal with expiration date field and delete action"
  ```

---

### Task 4: Update `GroupsGrid` cards

**Files:**
- Modify: `src/features/groups/GroupsGrid.tsx`

- [ ] **Step 1: Replace the entire file**

  ```tsx
  import { GroupItem, useAppData } from "../../state/AppDataContext";

  function isExpired(group: GroupItem): boolean {
    return !!group.expiresAt && new Date(group.expiresAt) < new Date();
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  interface GroupsGridProps {
    groups: GroupItem[];
    onEdit: (group: GroupItem) => void;
    onDelete: (id: string) => void;
  }

  export function GroupsGrid({ groups, onEdit, onDelete }: GroupsGridProps) {
    const { contacts } = useAppData();

    if (!groups.length) {
      return (
        <div className="page-card">
          No groups yet. Click <strong>Add Group</strong> to create one.
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {groups.map((group) => {
          const memberCount = contacts.filter((c) =>
            c.groupIds.includes(group.id)
          ).length;
          const expired = isExpired(group);

          return (
            <article
              className="page-card"
              key={group.id}
              style={{ opacity: expired ? 0.45 : 1 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.25rem",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {group.name}
                  {group.expiresAt && (
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: "0.72rem",
                        color: expired ? "#ef4444" : "#94a3b8",
                        marginLeft: "0.5rem",
                      }}
                    >
                      · {formatDate(group.expiresAt)}
                      {expired && " (Expired)"}
                    </span>
                  )}
                </h3>
                <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0, marginLeft: "0.5rem" }}>
                  <button
                    onClick={() => onEdit(group)}
                    title="Edit group"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "#475569",
                      padding: "0.1rem 0.3rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(group.id)}
                    title="Delete group"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "#dc2626",
                      padding: "0.1rem 0.3rem",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ color: "#475569" }}>
                {group.description || "No description"}
              </p>
              <p style={{ marginBottom: 0, fontWeight: 700 }}>
                {memberCount} members
              </p>
            </article>
          );
        })}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify types compile**

  ```bash
  npx tsc --noEmit
  ```

  Expected: errors about `GroupsPage` not passing `onEdit`/`onDelete` props yet — resolved in Task 5.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/groups/GroupsGrid.tsx
  git commit -m "feat: add expiration display and edit/delete actions to group cards"
  ```

---

### Task 5: Wire `GroupsPage`

**Files:**
- Modify: `src/features/groups/GroupsPage.tsx`

- [ ] **Step 1: Replace the entire file**

  ```tsx
  import { useState } from "react";
  import { PageHeader } from "../../components/layout/PageHeader";
  import { Button } from "../../components/ui/Button";
  import { GroupItem, useAppData } from "../../state/AppDataContext";
  import { GroupsGrid } from "./GroupsGrid";
  import { GroupFormModal } from "./GroupFormModal";

  export function GroupsPage() {
    const { groups, addGroup, updateGroup, deleteGroup } = useAppData();
    const [open, setOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

    const handleEdit = (group: GroupItem) => {
      setEditingGroup(group);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setEditingGroup(null);
    };

    const handleSubmit = (payload: {
      name: string;
      description: string;
      expiresAt?: string;
    }) => {
      if (editingGroup) {
        updateGroup(editingGroup.id, payload);
      } else {
        addGroup(payload);
      }
    };

    const handleDeleteFromModal = () => {
      if (editingGroup) {
        deleteGroup(editingGroup.id);
        handleClose();
      }
    };

    return (
      <div>
        <PageHeader
          title="Groups"
          subtitle="Organize contacts into reusable recipient lists."
        />
        <div style={{ marginBottom: "0.75rem" }}>
          <Button
            onClick={() => {
              setEditingGroup(null);
              setOpen(true);
            }}
          >
            Add Group
          </Button>
        </div>
        <GroupsGrid
          groups={groups}
          onEdit={handleEdit}
          onDelete={deleteGroup}
        />
        <GroupFormModal
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDelete={editingGroup ? handleDeleteFromModal : undefined}
          initialValues={
            editingGroup
              ? {
                  name: editingGroup.name,
                  description: editingGroup.description,
                  expiresAt: editingGroup.expiresAt,
                }
              : undefined
          }
        />
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify types compile cleanly**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors (only Task 6's SendEmailPage change remains).

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/groups/GroupsPage.tsx
  git commit -m "feat: wire GroupsPage with edit/delete state and GroupFormModal"
  ```

---

### Task 6: Filter expired groups in `SendEmailPage`

**Files:**
- Modify: `src/features/send-email/SendEmailPage.tsx`

- [ ] **Step 1: Add `activeGroups` derived value and pass it to `GroupRecipientPanel`**

  After the line:
  ```ts
  const { contacts, groups, settings } = useAppData();
  ```

  Add:
  ```ts
  const activeGroups = groups.filter(
    (group) => !group.expiresAt || new Date(group.expiresAt) >= new Date()
  );
  ```

  Then in the JSX, replace the `groups` prop on `GroupRecipientPanel`:
  ```tsx
  <GroupRecipientPanel
    groups={activeGroups}
    ...
  ```

- [ ] **Step 2: Verify types compile cleanly**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/send-email/SendEmailPage.tsx
  git commit -m "feat: hide expired groups from email recipient selector"
  ```

---

### Task 7: Manual smoke test

- [ ] **Step 1: Start the dev server**

  ```bash
  npm run dev
  ```

- [ ] **Step 2: Verify these scenarios work**

  1. Navigate to Groups page — existing cards show "Edit" and "Delete" text buttons
  2. Click "Add Group" — modal opens with title "Add Group", no delete button in footer
  3. Fill name + description + expiration date, click Save — new card appears with date shown next to the name
  4. Click "Edit" on a card — modal opens with title "Edit Group" and fields pre-filled, delete button visible
  5. Change a field and Save — card updates
  6. Click "Edit" on a card, click "Delete" — group removed from list
  7. Click "Delete" directly on a card — group removed
  8. Set an expiration date in the past — card renders faded with "(Expired)" label, date shown in red
  9. Navigate to Send Email → Group Mode — expired group does not appear in the group selector dropdown
  10. Assign a contact to a non-expired group, then expire the group — contact remains in the group but group is not selectable in email flow
