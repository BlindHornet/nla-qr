import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { GroupsGrid } from './GroupsGrid';
import { NewGroupModal } from './NewGroupModal';

interface GroupItem {
  id: string;
  name: string;
  description: string;
}

export function GroupsPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Groups" subtitle="Organize contacts into reusable recipient lists." />
      <div style={{ marginBottom: '0.75rem' }}>
        <Button onClick={() => setOpen(true)}>Add Group</Button>
      </div>
      <GroupsGrid groups={groups} />
      <NewGroupModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(payload) =>
          setGroups((current) => [...current, { id: crypto.randomUUID(), ...payload }])
        }
      />
    </div>
  );
}
