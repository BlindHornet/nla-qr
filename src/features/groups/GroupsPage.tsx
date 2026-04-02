import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useAppData } from '../../state/AppDataContext';
import { GroupsGrid } from './GroupsGrid';
import { NewGroupModal } from './NewGroupModal';
import { useState } from 'react';

export function GroupsPage() {
  const { groups, addGroup } = useAppData();
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
        onSubmit={(payload) => addGroup(payload)}
      />
    </div>
  );
}
