import { ContactItem } from '../../state/AppDataContext';

interface IndividualRecipientPanelProps {
  contacts: ContactItem[];
  search: string;
  selectedIds: string[];
  onSearchChange: (value: string) => void;
  onToggleRecipient: (contactId: string) => void;
}

export function IndividualRecipientPanel({
  contacts,
  search,
  selectedIds,
  onSearchChange,
  onToggleRecipient
}: IndividualRecipientPanelProps) {
  const normalized = search.trim().toLowerCase();
  const filtered = normalized
    ? contacts.filter((contact) =>
        `${contact.firstName} ${contact.lastName} ${contact.email}`.toLowerCase().includes(normalized)
      )
    : contacts;

  return (
    <div className="page-card" style={{ display: 'grid', gap: '0.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Individual Mode</h3>
      <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search contact" />
      {filtered.map((contact) => (
        <label key={contact.id}>
          <input
            type="checkbox"
            style={{ width: 'auto', marginRight: '0.35rem' }}
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
