# CSV Import UX + Group Email Select All

**Date:** 2026-04-02  
**Status:** Approved

## Overview

Two independent UX improvements:
1. CSV import modal shows the expected format, validates rows, lists skipped rows with reasons, and requires explicit confirmation before importing.
2. Group email panel defaults to all members selected when a group is chosen, with Select All / Deselect All buttons.

---

## Feature 1: CSV Import Overhaul

### `src/lib/csv.ts` — Extended return type

`parseCSVText` currently returns `CSVContactRow[]` (silently dropping invalid rows). It is updated to return a `ParseResult` that includes both valid rows and details on every skipped row.

```ts
export interface SkippedRow {
  rowNumber: number; // 1-based, not counting the header
  raw: string;       // the original CSV line
  reason: string;    // human-readable: "Missing first name" | "Missing last name" | "Missing email"
}

export interface ParseResult {
  valid: CSVContactRow[];
  skipped: SkippedRow[];
}

export function parseCSVText(csvText: string): ParseResult
```

`reason` priority: if multiple fields are missing, report only the first missing one in order: firstName → lastName → email.

`validateCSVRow` is kept but its return value is used internally only.

### `src/features/contacts/CSVImportModal.tsx` — Two-pass flow

**State:**
- `parseResult: ParseResult | null` — null until a file is picked
- `selectedGroupId: string` — unchanged

**Layout (top to bottom):**
1. Format hint (always visible): small grey text — `Required columns: firstName, lastName, email`
2. Group selector (unchanged)
3. File input — picking a file triggers parse only, stores `parseResult`, does NOT call `onImport`
4. If `parseResult` is set:
   - Valid rows summary: `"23 contacts ready to import"` (green if > 0, grey if 0)
   - Skipped rows list (only if `parseResult.skipped.length > 0`): each entry on its own line — `Row 4: Missing email — "Smith, John, "`
   - Confirm button: `"Import {N} Contacts"` — disabled if `valid.length === 0` — clicking this calls `onImport(parseResult.valid, selectedGroupId || undefined)` then closes the modal
5. If `parseResult.valid.length === 0` and skipped rows exist: show `"No valid contacts found. Fix the file and try again."`

**Behaviour:**
- Picking a new file replaces `parseResult` (re-parse)
- Modal close resets all state (fileName, parseResult, selectedGroupId)
- `onImport` is no longer called on file pick — only on confirm button click

### `AppDataContext.importContacts` — no change needed

The mutation already accepts `CSVContactRow[]` and a `groupId`. Only the call site changes (moved from file-pick to button-click).

---

## Feature 2: Group Email — Default Select All

### `src/features/send-email/SendEmailPage.tsx`

`onSelectGroup` handler changes from:
```ts
(groupId) => {
  setSelectedGroupId(groupId);
  setSelectedIds([]);
}
```
to:
```ts
(groupId) => {
  setSelectedGroupId(groupId);
  const memberIds = contacts
    .filter((c) => c.groupIds.includes(groupId))
    .map((c) => c.id);
  setSelectedIds(memberIds);
}
```

Two new handlers passed to `GroupRecipientPanel`:
```ts
onSelectAll={() => {
  const memberIds = contacts
    .filter((c) => c.groupIds.includes(selectedGroupId))
    .map((c) => c.id);
  setSelectedIds(memberIds);
}}
onDeselectAll={() => setSelectedIds([])}
```

### `src/features/send-email/GroupRecipientPanel.tsx`

Two new props added:
```ts
onSelectAll: () => void;
onDeselectAll: () => void;
```

Two buttons rendered above the contact list, only when `selectedGroupId` is set and `members.length > 0`:
```tsx
<div style={{ display: "flex", gap: "0.5rem" }}>
  <button ... onClick={onSelectAll}>Select All</button>
  <button ... onClick={onDeselectAll}>Deselect All</button>
</div>
```

Use `btn btn-secondary` class for both buttons. Individual checkboxes unchanged.

---

## Out of Scope

- CSV column reordering or aliasing (e.g. `first_name` → `firstName`)
- Inline row editing before import
- Undo after import
- Indeterminate "Select All" checkbox state
- Persisting group selection across page navigation
