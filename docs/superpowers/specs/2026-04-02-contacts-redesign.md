# Contacts Page Redesign

**Date:** 2026-04-02  
**Status:** Approved

## Overview

Redesign the Contacts page to support search, collapsible group sections, inline edit (via modal), and delete with confirmation. Replace the existing `ContactsTable` with a new `ContactsView` component.

## Requirements

- Single search box that filters contacts by name across all group sections simultaneously
- Contacts displayed in collapsible group sections (default collapsed); a contact in multiple groups appears in each group's section
- Contacts with no group assignment appear in an "Ungrouped" section (only shown when at least one such contact exists)
- Each contact row has an Edit icon and a Delete icon
- Edit opens a modal pre-populated with the contact's current values; supports changing name, email, and group assignments
- Delete shows a confirmation modal before removing the contact
- Count badge on each group header updates to reflect how many contacts match the current search, even while collapsed

## Data & Mutations

Two new mutations added to `AppDataContext`:

```ts
updateContact(id: string, payload: { firstName: string; lastName: string; email: string; groupIds: string[] }): Promise<void>
deleteContact(id: string): Promise<void>
```

- `updateContact` — calls `updateDoc` on `contacts/{id}`
- `deleteContact` — calls `deleteDoc` on `contacts/{id}`

`AppDataContextValue` interface updated to declare both. No changes to `ContactItem` shape.

## Component Structure

```
ContactsPage
├── PageHeader
├── Action buttons (Add Contact, Import CSV)
├── SearchInput                      ← filters by name (single box)
└── ContactsView                     ← contacts, groups, search, onEdit, onDelete
    ├── Empty state (zero total contacts)
    ├── Ungrouped section (optional, contacts with groupIds.length === 0)
    └── One section per group (sorted alphabetically by group name)
        ├── Header: group name + match count badge, click to toggle
        └── [When expanded] Contact rows matching search
            └── Name | Email | Edit button | Delete button
```

`ContactsTable` is deleted entirely.

## ContactsView

- Props: `contacts: ContactItem[]`, `groups: GroupItem[]`, `search: string`, `onEdit: (c: ContactItem) => void`, `onDelete: (c: ContactItem) => void`
- Collapse state: `Record<string, boolean>` keyed by group ID, all default `false` (collapsed)
- Filtering: a contact matches the search if `firstName + ' ' + lastName` contains the search string (case-insensitive)
- Groups sorted alphabetically; ungrouped section always last
- Sections with zero matching contacts are hidden entirely when a search is active; when no search is active, all sections render (even empty groups show their header)

## ContactForm — Edit Mode Extension

- Add optional props: `initialValues?: { firstName: string; lastName: string; email: string; groupIds: string[] }` and `contactId?: string`
- When `initialValues` is provided, fields pre-populate and submit calls `updateContact`
- When absent, behavior is unchanged (create flow)
- Modal title changes to "Edit Contact" when in edit mode

## ContactsPage — Modal State

Two new state values:

```ts
const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
const [deletingContact, setDeletingContact] = useState<ContactItem | null>(null);
```

**Edit modal:** Opens when `editingContact` is set. Renders `ContactForm` with `initialValues` and `contactId`. On submit calls `updateContact`, then clears `editingContact`. On close clears `editingContact`.

**Delete modal:** Opens when `deletingContact` is set. Shows confirmation message: "Are you sure you want to delete **[First Last]**? This cannot be undone." Two buttons: Cancel (secondary) and Delete (primary, danger styling). On confirm calls `deleteContact(id)`, then clears `deletingContact`. On cancel/close clears `deletingContact`.

## CSS / Styling

- Group headers use the existing `page-card` class as a container, with a chevron icon (▶ / ▼) to indicate collapsed/expanded state
- Contact rows inside an expanded section are plain rows separated by a subtle border — no additional card nesting
- Delete button uses a red/danger color (inline style `color: #c00`) to signal destructive action
- Count badge: small inline pill next to the group name showing number of matching contacts (e.g. "Year 3  **12**")
- Follows existing pattern: inline styles for one-off layout, global classes for recurring patterns

## Out of Scope

- Bulk delete / bulk edit
- Sorting contacts within a section
- Contacts with multiple email addresses (the `EmailArrayField` component exists but is not used here)
- Undo/toast after delete
