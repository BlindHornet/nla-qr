import { GroupItem, useAppData } from "../../state/AppDataContext";

function isExpired(group: GroupItem): boolean {
  return !!group.expiresAt && new Date(group.expiresAt) < new Date();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface GroupsGridProps {
  groups: GroupItem[];
  onEdit: (group: GroupItem) => void;
  onDelete: (id: string) => void;
}

export function GroupsGrid({ groups, onEdit, onDelete }: GroupsGridProps) {
  const { contacts } = useAppData();

  if (!groups.length) {
    return (
      <div className="page-card">
        No groups yet. Click <strong>Add Group</strong> to create one.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      {groups.map((group) => {
        const memberCount = contacts.filter((c) =>
          c.groupIds.includes(group.id)
        ).length;
        const expired = isExpired(group);

        return (
          <article
            className="page-card"
            key={group.id}
            style={{ opacity: expired ? 0.45 : 1 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.25rem",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {group.name}
                {group.expiresAt && (
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "0.72rem",
                      color: expired ? "#ef4444" : "#94a3b8",
                      marginLeft: "0.5rem",
                    }}
                  >
                    · {formatDate(group.expiresAt)}
                    {expired && " (Expired)"}
                  </span>
                )}
              </h3>
              <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0, marginLeft: "0.5rem" }}>
                <button
                  onClick={() => onEdit(group)}
                  title="Edit group"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    color: "#475569",
                    padding: "0.1rem 0.3rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(group.id)}
                  title="Delete group"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    color: "#dc2626",
                    padding: "0.1rem 0.3rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <p style={{ color: "#475569" }}>
              {group.description || "No description"}
            </p>
            <p style={{ marginBottom: 0, fontWeight: 700 }}>
              {memberCount} members
            </p>
          </article>
        );
      })}
    </div>
  );
}
