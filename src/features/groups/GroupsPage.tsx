import { PageHeader } from '../../components/layout/PageHeader';
import { GroupsGrid } from './GroupsGrid';

export function GroupsPage() {
  return (
    <div>
      <PageHeader title="Groups" subtitle="Organize contacts into reusable recipient lists." />
      <GroupsGrid />
    </div>
  );
}
