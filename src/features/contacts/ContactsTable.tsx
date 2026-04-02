import { ContactItem, GroupItem } from '../../state/AppDataContext';

interface ContactsTableProps {
  contacts: ContactItem[];
  groups: GroupItem[];
}

export function ContactsTable({ contacts, groups }: ContactsTableProps) {
  if (!contacts.length) {
    return (
      <div className="page-card">No contacts yet. Click <strong>Add Contact</strong> or <strong>Import CSV</strong>.</div>
    );
  }

  const mapGroupName = (groupId: string) => groups.find((group) => group.id === groupId)?.name ?? 'Unknown';

  return (
    <div className="page-card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Primary Email</th>
            <th align="left">Groups</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td style={{ paddingTop: '0.5rem' }}>
                {contact.firstName} {contact.lastName}
              </td>
              <td style={{ paddingTop: '0.5rem' }}>{contact.email}</td>
              <td style={{ paddingTop: '0.5rem' }}>
                {contact.groupIds.length
                  ? contact.groupIds.map(mapGroupName).join(', ')
                  : 'No groups'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
