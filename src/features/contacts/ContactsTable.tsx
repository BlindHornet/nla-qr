<<<<<<< HEAD
import { ContactItem, GroupItem } from '../../state/AppDataContext';

interface ContactsTableProps {
  contacts: ContactItem[];
  groups: GroupItem[];
}

export function ContactsTable({ contacts, groups }: ContactsTableProps) {
=======
interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ContactsTableProps {
  contacts: ContactItem[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
>>>>>>> main
  if (!contacts.length) {
    return (
      <div className="page-card">No contacts yet. Click <strong>Add Contact</strong> or <strong>Import CSV</strong>.</div>
    );
  }

<<<<<<< HEAD
  const mapGroupName = (groupId: string) => groups.find((group) => group.id === groupId)?.name ?? 'Unknown';

=======
>>>>>>> main
  return (
    <div className="page-card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Primary Email</th>
<<<<<<< HEAD
            <th align="left">Groups</th>
=======
>>>>>>> main
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
<<<<<<< HEAD
              <td style={{ paddingTop: '0.5rem' }}>
                {contact.firstName} {contact.lastName}
              </td>
              <td style={{ paddingTop: '0.5rem' }}>{contact.email}</td>
              <td style={{ paddingTop: '0.5rem' }}>
                {contact.groupIds.length
                  ? contact.groupIds.map(mapGroupName).join(', ')
                  : 'No groups'}
              </td>
=======
              <td style={{ paddingTop: '0.5rem' }}>{contact.firstName} {contact.lastName}</td>
              <td style={{ paddingTop: '0.5rem' }}>{contact.email}</td>
>>>>>>> main
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
