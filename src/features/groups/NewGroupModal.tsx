import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface NewGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string }) => void;
}

export function NewGroupModal({ open, onClose, onSubmit }: NewGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal open={open} title="Add Group" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.6rem' }}>
        <input placeholder="Group name" value={name} onChange={(event) => setName(event.target.value)} />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button type="submit">Save Group</Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
