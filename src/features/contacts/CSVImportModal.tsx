import { ChangeEvent, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { parseCSVText } from '../../lib/csv';

interface CSVImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (rows: Array<{ firstName: string; lastName: string; email: string }>) => void;
}

export function CSVImportModal({ open, onClose, onImport }: CSVImportModalProps) {
  const [fileName, setFileName] = useState('');
  const [count, setCount] = useState(0);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    const parsed = parseCSVText(text);
    setCount(parsed.length);
    onImport(parsed);
  };

  return (
    <Modal open={open} title="Import Contacts from CSV" onClose={onClose}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <input type="file" accept=".csv,text/csv" onChange={handleFile} />
        {fileName ? <p style={{ margin: 0 }}>Loaded {fileName} ({count} valid rows)</p> : null}
      </div>
    </Modal>
  );
}
