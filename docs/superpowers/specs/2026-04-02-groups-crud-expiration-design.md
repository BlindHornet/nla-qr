# Groups CRUD + Expiration Design

**Date:** 2026-04-02

## Overview

Add full CRUD (create, edit, delete) to the Groups page, plus an optional expiration date per group. Expired groups are visually faded, excluded from the email recipient selector, and prevent new contact assignments.

---

## Data Model

`GroupItem` in `AppDataContext` gains one optional field:

```ts
interface GroupItem {
  id: string;
  name: string;
  description: string;
  expiresAt?: string; // ISO date string, e.g. "2026-06-01"
}
```

A group is considered **expired** when `expiresAt` is set and `new Date(expiresAt) < new Date()`.

### New context actions

| Action | Signature | Behavior |
|--------|-----------|----------|
| `updateGroup` | `(id: string, payload: { name: string; description: string; expiresAt?: string }) => void` | Updates the matching group in state |
| `deleteGroup` | `(id: string) => void` | Removes the group; strips the `groupId` from any contacts that referenced it |

`useGroups` hook is updated to expose `updateGroup` and `deleteGroup`.

---

## `GroupFormModal`

Replaces `NewGroupModal`. Single modal for both create and edit.

```ts
interface GroupFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string; expiresAt?: string }) => void;
  onDelete?: () => void;       // only passed when editing
  initialValues?: {
    name: string;
    description: string;
    expiresAt?: string;
  };
}
```

- **Title:** "Add Group" (no `initialValues`) / "Edit Group" (with `initialValues`)
- **Fields:**
  - Name — required text input
  - Description — optional textarea
  - Expiration date — optional `<input type="date">`
- **Footer:** Save + Cancel; Delete button appears (destructive style) when `onDelete` is provided
- On submit: resets local state, calls `onClose`

---

## `GroupsGrid` Cards

Each card updated with:

- **Expiration date next to the group name** — rendered as `· Jun 1, 2026` in smaller, muted text inline with the `<h3>`; omitted when no expiration is set
- **Edit + Delete action buttons** in the top-right corner of the card
- **Expired state:** when `expiresAt` is past today, card renders at `opacity: 0.45` with an "Expired" badge near the date

`GroupsGrid` receives two new props:
- `onEdit: (group: GroupItem) => void`
- `onDelete: (id: string) => void`

---

## `GroupsPage` Wiring

- Maintains `editingGroup: GroupItem | null` state
- "Add Group" opens `GroupFormModal` with no `initialValues`
- Edit action on a card sets `editingGroup` and opens the modal with `initialValues` populated
- Delete action on a card calls `deleteGroup(id)` directly (no confirmation modal)
- A single `GroupFormModal` instance handles both create and edit

---

## Send Email Integration

- `GroupRecipientPanel` (and any other place groups are listed as recipients) filters out expired groups before rendering
- Expired = `expiresAt` is set and `new Date(expiresAt) < new Date()`
- This prevents expired groups from appearing as selectable recipients

---

## Files Changed

| File | Change |
|------|--------|
| `src/state/AppDataContext.tsx` | Add `expiresAt` to `GroupItem`; add `updateGroup`, `deleteGroup` to context |
| `src/hooks/useGroups.ts` | Expose `updateGroup`, `deleteGroup` |
| `src/features/groups/NewGroupModal.tsx` | Replace with `GroupFormModal.tsx` |
| `src/features/groups/GroupsGrid.tsx` | Add expiration display, edit/delete buttons, expired styling |
| `src/features/groups/GroupsPage.tsx` | Wire edit/delete state and modal |
| `src/features/send-email/GroupRecipientPanel.tsx` | Filter expired groups |
