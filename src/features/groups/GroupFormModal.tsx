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
