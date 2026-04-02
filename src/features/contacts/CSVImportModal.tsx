import { ChangeEvent, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { parseCSVText } from '../../lib/csv';
<<<<<<< HEAD
import { GroupItem } from '../../state/AppDataContext';

interface CSVImportModalProps {
  open: boolean;
  groups: GroupItem[];
  onClose: () => void;
  onImport: (rows: Array<{ firstName: string; lastName: string; email: string }>, groupId?: string) => void;
}

export function CSVImportModal({ open, groups, onClose, onImport }: CSVImportModalProps) {
  const [fileName, setFileName] = useState('');
  const [count, setCount] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState('');
=======

interface CSVImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (rows: Array<{ firstName: string; lastName: string; email: string }>) => void;
}

export function CSVImportModal({ open, onClose, onImport }: CSVImportModalProps) {
  const [fileName, setFileName] = useState('');
  const [count, setCount] = useState(0);
>>>>>>> main

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    const parsed = parseCSVText(text);
    setCount(parsed.length);
<<<<<<< HEAD
    onImport(parsed, selectedGroupId || undefined);
=======
    onImport(parsed);
>>>>>>> main
  };

  return (
    <Modal open={open} title="Import Contacts from CSV" onClose={onClose}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
<<<<<<< HEAD
        <label>
          Add imported contacts to group
          <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
            <option value="">None</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
=======
>>>>>>> main
        <input type="file" accept=".csv,text/csv" onChange={handleFile} />
        {fileName ? <p style={{ margin: 0 }}>Loaded {fileName} ({count} valid rows)</p> : null}
      </div>
    </Modal>
  );
}
