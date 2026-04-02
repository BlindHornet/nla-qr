import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';
<<<<<<< HEAD
import { GroupItem } from '../../state/AppDataContext';

interface ContactFormProps {
  groups: GroupItem[];
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    groupIds: string[];
  }) => void;
}

export function ContactForm({ groups, onSubmit }: ContactFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [groupIds, setGroupIds] = useState<string[]>([]);
=======

interface ContactFormProps {
  onSubmit: (payload: { firstName: string; lastName: string; email: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
>>>>>>> main

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
<<<<<<< HEAD
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), groupIds });
    setFirstName('');
    setLastName('');
    setEmail('');
    setGroupIds([]);
  };

  const toggleGroup = (groupId: string) => {
    setGroupIds((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]
    );
=======
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    setFirstName('');
    setLastName('');
    setEmail('');
>>>>>>> main
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
      <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<<<<<<< HEAD
      <div className="page-card" style={{ padding: '0.5rem' }}>
        <strong>Assign to Groups</strong>
        {groups.length ? (
          groups.map((group) => (
            <label key={group.id} style={{ display: 'block', marginTop: '0.35rem' }}>
              <input
                type="checkbox"
                checked={groupIds.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
                style={{ width: 'auto', marginRight: '0.35rem' }}
              />
              {group.name}
            </label>
          ))
        ) : (
          <p style={{ marginBottom: 0 }}>No groups yet.</p>
        )}
      </div>
=======
>>>>>>> main
      <Button type="submit">Save Contact</Button>
    </form>
  );
}
