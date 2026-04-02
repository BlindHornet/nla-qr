import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';

interface ContactFormProps {
  onSubmit: (payload: { firstName: string; lastName: string; email: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
      <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit">Save Contact</Button>
    </form>
  );
}
