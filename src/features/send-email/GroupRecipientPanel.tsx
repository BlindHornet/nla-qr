<<<<<<< HEAD
import { ContactItem, GroupItem } from '../../state/AppDataContext';

interface GroupRecipientPanelProps {
  groups: GroupItem[];
  contacts: ContactItem[];
  selectedGroupId: string;
  selectedIds: string[];
  onSelectGroup: (groupId: string) => void;
  onToggleRecipient: (contactId: string) => void;
}

export function GroupRecipientPanel({
  groups,
  contacts,
  selectedGroupId,
  selectedIds,
  onSelectGroup,
  onToggleRecipient
}: GroupRecipientPanelProps) {
  const members = selectedGroupId
    ? contacts.filter((contact) => contact.groupIds.includes(selectedGroupId))
    : [];

  return (
    <div className="page-card" style={{ display: 'grid', gap: '0.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Group Mode</h3>
      <select value={selectedGroupId} onChange={(e) => onSelectGroup(e.target.value)}>
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option value={group.id} key={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      {members.map((contact) => (
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
=======
export function GroupRecipientPanel() {
  return null;
>>>>>>> main
}
