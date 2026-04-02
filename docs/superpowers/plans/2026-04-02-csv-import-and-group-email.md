# CSV Import UX + Group Email Select All Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CSV import show the expected format, validate rows with per-row error details and require explicit confirmation before importing; make group email default to all members selected with Select All / Deselect All buttons.

**Architecture:** Two independent features. Task 1 extends `csv.ts` parsing to return a `ParseResult` with valid rows and skipped row details. Task 2 rewrites `CSVImportModal` to use the new two-pass flow. Task 3 updates `GroupRecipientPanel` and `SendEmailPage` for default-select-all behaviour.

**Tech Stack:** React 18, TypeScript (strict), no test framework — `npx tsc --noEmit` is the verification step.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/lib/csv.ts` | Add `ParseResult` / `SkippedRow` types, update `parseCSVText` return type |
| Modify | `src/features/contacts/CSVImportModal.tsx` | Two-pass flow: parse on file pick, import on confirm button |
| Modify | `src/features/send-email/GroupRecipientPanel.tsx` | Add `onSelectAll` / `onDeselectAll` props and buttons |
| Modify | `src/features/send-email/SendEmailPage.tsx` | Default-select-all on group change, wire new panel props |

---

### Task 1: Extend `parseCSVText` to return `ParseResult`

**Files:**
- Modify: `src/lib/csv.ts`

- [ ] **Step 1: Replace `src/lib/csv.ts` with the updated version**

```ts
export interface CSVContactRow {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  email2?: string;
  email3?: string;
}

export interface SkippedRow {
  rowNumber: number; // 1-based, not counting the header
  raw: string;
  reason: string;
}

export interface ParseResult {
  valid: CSVContactRow[];
  skipped: SkippedRow[];
}

function getSkipReason(row: Partial<CSVContactRow>): string | null {
  if (!row.firstName) return "Missing first name";
  if (!row.lastName) return "Missing last name";
  if (!row.email) return "Missing email";
  return null;
}

export function parseCSVText(csvText: string): ParseResult {
  const [headerLine, ...lines] = csvText.split(/\r?\n/).filter(Boolean);
  if (!headerLine) return { valid: [], skipped: [] };

  const headers = headerLine.split(',').map((h) => h.trim());
  const valid: CSVContactRow[] = [];
  const skipped: SkippedRow[] = [];

  lines.forEach((line, index) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Partial<CSVContactRow> = {};
    headers.forEach((header, i) => {
      row[header as keyof CSVContactRow] = values[i] as never;
    });

    const reason = getSkipReason(row);
    if (reason) {
      skipped.push({ rowNumber: index + 1, raw: line, reason });
    } else {
      valid.push(row as CSVContactRow);
    }
  });

  return { valid, skipped };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: errors — `CSVImportModal` still calls `parseCSVText` and expects the old `CSVContactRow[]` return type. That's fine — it proves the type is broken and we'll fix it in Task 2.

- [ ] **Step 3: Commit**

```bash
git add src/lib/csv.ts
git commit -m "feat: extend parseCSVText to return ParseResult with skipped row details"
```

---

### Task 2: Rewrite `CSVImportModal` with two-pass flow

**Files:**
- Modify: `src/features/contacts/CSVImportModal.tsx`

- [ ] **Step 1: Replace `src/features/contacts/CSVImportModal.tsx` with the new version**

```tsx
import { ChangeEvent, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ParseResult, parseCSVText } from "../../lib/csv";
import { GroupItem } from "../../state/AppDataContext";

interface CSVImportModalProps {
  open: boolean;
  groups: GroupItem[];
  onClose: () => void;
  onImport: (
    rows: Array<{ firstName: string; lastName: string; email: string }>,
    groupId?: string,
  ) => void;
}

export function CSVImportModal({
  open,
  groups,
  onClose,
  onImport,
}: CSVImportModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);

  const handleClose = () => {
    setSelectedGroupId("");
    setParseResult(null);
    onClose();
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setParseResult(parseCSVText(text));
  };

  const handleImport = () => {
    if (!parseResult || parseResult.valid.length === 0) return;
    onImport(parseResult.valid, selectedGroupId || undefined);
    handleClose();
  };

  return (
    <Modal open={open} title="Import Contacts from CSV" onClose={handleClose}>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
          Required columns: <code>firstName</code>, <code>lastName</code>,{" "}
          <code>email</code>
        </p>

        <label>
          Add imported contacts to group
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            <option value="">None</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>

        <input type="file" accept=".csv,text/csv" onChange={handleFile} />

        {parseResult && (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {parseResult.valid.length > 0 ? (
              <p style={{ margin: 0, color: "#16a34a" }}>
                {parseResult.valid.length} contact
                {parseResult.valid.length !== 1 ? "s" : ""} ready to import
              </p>
            ) : (
              <p style={{ margin: 0, color: "#64748b" }}>
                No valid contacts found. Fix the file and try again.
              </p>
            )}

            {parseResult.skipped.length > 0 && (
              <div>
                <p style={{ margin: "0 0 0.25rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  {parseResult.skipped.length} row
                  {parseResult.skipped.length !== 1 ? "s" : ""} skipped:
                </p>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#b91c1c" }}>
                  {parseResult.skipped.map((row) => (
                    <li key={row.rowNumber}>
                      Row {row.rowNumber}: {row.reason} —{" "}
                      <code style={{ fontSize: "0.78rem" }}>&ldquo;{row.raw}&rdquo;</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={parseResult.valid.length === 0}
            >
              Import {parseResult.valid.length} Contact
              {parseResult.valid.length !== 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </div>
    </Modal>
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
git add src/features/contacts/CSVImportModal.tsx
git commit -m "feat: rewrite CSVImportModal with two-pass flow and per-row error details"
```

---

### Task 3: Group email — default select all + Select All / Deselect All

**Files:**
- Modify: `src/features/send-email/GroupRecipientPanel.tsx`
- Modify: `src/features/send-email/SendEmailPage.tsx`

- [ ] **Step 1: Replace `src/features/send-email/GroupRecipientPanel.tsx`**

```tsx
import { ContactItem, GroupItem } from "../../state/AppDataContext";

interface GroupRecipientPanelProps {
  groups: GroupItem[];
  contacts: ContactItem[];
  selectedGroupId: string;
  selectedIds: string[];
  onSelectGroup: (groupId: string) => void;
  onToggleRecipient: (contactId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function GroupRecipientPanel({
  groups,
  contacts,
  selectedGroupId,
  selectedIds,
  onSelectGroup,
  onToggleRecipient,
  onSelectAll,
  onDeselectAll,
}: GroupRecipientPanelProps) {
  const members = selectedGroupId
    ? contacts.filter((contact) => contact.groupIds.includes(selectedGroupId))
    : [];

  return (
    <div className="page-card" style={{ display: "grid", gap: "0.5rem" }}>
      <h3 style={{ marginTop: 0 }}>Group Mode</h3>
      <select
        value={selectedGroupId}
        onChange={(e) => onSelectGroup(e.target.value)}
      >
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option value={group.id} key={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      {selectedGroupId && members.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={onSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={onDeselectAll}
          >
            Deselect All
          </button>
        </div>
      )}

      {members.map((contact) => (
        <label key={contact.id}>
          <input
            type="checkbox"
            style={{ width: "auto", marginRight: "0.35rem" }}
            checked={selectedIds.includes(contact.id)}
            onChange={() => onToggleRecipient(contact.id)}
          />
          {contact.firstName} {contact.lastName} ({contact.email})
        </label>
      ))}
      <small>Selected: {selectedIds.length}</small>
    </div>
  );
}
```

- [ ] **Step 2: Update `onSelectGroup` and add `onSelectAll`/`onDeselectAll` in `SendEmailPage.tsx`**

In `src/features/send-email/SendEmailPage.tsx`, find the `GroupRecipientPanel` usage (around line 104–115) and replace it with:

```tsx
<GroupRecipientPanel
  groups={activeGroups}
  contacts={contacts}
  selectedGroupId={selectedGroupId}
  selectedIds={selectedIds}
  onSelectGroup={(groupId) => {
    setSelectedGroupId(groupId);
    const memberIds = contacts
      .filter((c) => c.groupIds.includes(groupId))
      .map((c) => c.id);
    setSelectedIds(memberIds);
  }}
  onToggleRecipient={toggleRecipient}
  onSelectAll={() => {
    const memberIds = contacts
      .filter((c) => c.groupIds.includes(selectedGroupId))
      .map((c) => c.id);
    setSelectedIds(memberIds);
  }}
  onDeselectAll={() => setSelectedIds([])}
/>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/send-email/GroupRecipientPanel.tsx src/features/send-email/SendEmailPage.tsx
git commit -m "feat: default select all group members on group change with Select All / Deselect All buttons"
```
