import { ContactItem, GroupItem } from "../../state/AppDataContext";

interface GroupRecipientPanelProps {
  groups: GroupItem[];
  contacts: ContactItem[];
  selectedGroupId: string;
  selectedIds: string[];
  onSelectGroup: (groupId: string) => void;
  onToggleRecipient: (contactId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function GroupRecipientPanel({
  groups,
  contacts,
  selectedGroupId,
  selectedIds,
  onSelectGroup,
  onToggleRecipient,
  onSelectAll,
  onDeselectAll,
}: GroupRecipientPanelProps) {
  const members = selectedGroupId
    ? contacts.filter((contact) => contact.groupIds.includes(selectedGroupId))
    : [];

  return (
    <div className="page-card" style={{ display: "grid", gap: "0.5rem" }}>
      <h3 style={{ marginTop: 0 }}>Group Mode</h3>
      <select
        value={selectedGroupId}
        onChange={(e) => onSelectGroup(e.target.value)}
      >
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option value={group.id} key={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      {selectedGroupId && members.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={onSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={onDeselectAll}
          >
            Deselect All
          </button>
        </div>
      )}

      {members.map((contact) => (
        <label key={contact.id}>
          <input
            type="checkbox"
            style={{ width: "auto", marginRight: "0.35rem" }}
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
