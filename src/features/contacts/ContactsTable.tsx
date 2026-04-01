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
  if (!contacts.length) {
    return (
      <div className="page-card">No contacts yet. Click <strong>Add Contact</strong> or <strong>Import CSV</strong>.</div>
    );
  }

  return (
    <div className="page-card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Primary Email</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td style={{ paddingTop: '0.5rem' }}>{contact.firstName} {contact.lastName}</td>
              <td style={{ paddingTop: '0.5rem' }}>{contact.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
