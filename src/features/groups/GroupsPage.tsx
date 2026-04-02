import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { GroupItem, useAppData } from "../../state/AppDataContext";
import { GroupsGrid } from "./GroupsGrid";
import { GroupFormModal } from "./GroupFormModal";

export function GroupsPage() {
  const { groups, addGroup, updateGroup, deleteGroup } = useAppData();
  const [open, setOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

  const handleEdit = (group: GroupItem) => {
    setEditingGroup(group);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGroup(null);
  };

  const handleSubmit = (payload: {
    name: string;
    description: string;
    expiresAt?: string;
  }) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, payload);
    } else {
      addGroup(payload);
    }
  };

  const handleDeleteFromModal = () => {
    if (editingGroup) {
      deleteGroup(editingGroup.id);
      handleClose();
    }
  };

  return (
    <div>
      <PageHeader
        title="Groups"
        subtitle="Organize contacts into reusable recipient lists."
      />
      <div style={{ marginBottom: "0.75rem" }}>
        <Button
          onClick={() => {
            setEditingGroup(null);
            setOpen(true);
          }}
        >
          Add Group
        </Button>
      </div>
      <GroupsGrid
        groups={groups}
        onEdit={handleEdit}
        onDelete={deleteGroup}
      />
      <GroupFormModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onDelete={editingGroup ? handleDeleteFromModal : undefined}
        initialValues={
          editingGroup
            ? {
                name: editingGroup.name,
                description: editingGroup.description,
                expiresAt: editingGroup.expiresAt,
              }
            : undefined
        }
      />
    </div>
  );
}
