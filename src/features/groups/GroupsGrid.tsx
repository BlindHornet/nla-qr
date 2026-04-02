import { GroupItem, useAppData } from '../../state/AppDataContext';

interface GroupsGridProps {
  groups: GroupItem[];
}

export function GroupsGrid({ groups }: GroupsGridProps) {
  const { contacts } = useAppData();

  if (!groups.length) {
    return <div className="page-card">No groups yet. Click <strong>Add Group</strong> to create one.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {groups.map((group) => {
        const memberCount = contacts.filter((contact) => contact.groupIds.includes(group.id)).length;
        return (
          <article className="page-card" key={group.id}>
            <h3 style={{ marginTop: 0 }}>{group.name}</h3>
            <p style={{ color: '#475569' }}>{group.description || 'No description'}</p>
            <p style={{ marginBottom: 0, fontWeight: 700 }}>{memberCount} members</p>
          </article>
        );
      })}
    </div>
  );
}
