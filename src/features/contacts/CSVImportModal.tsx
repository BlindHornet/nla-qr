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
