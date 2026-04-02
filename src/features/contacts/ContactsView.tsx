import { useState } from "react";
import { ContactItem, GroupItem } from "../../state/AppDataContext";

interface ContactsViewProps {
  contacts: ContactItem[];
  groups: GroupItem[];
  search: string;
  onEdit: (contact: ContactItem) => void;
  onDelete: (contact: ContactItem) => void;
}

export function ContactsView({
  contacts,
  groups,
  search,
  onEdit,
  onDelete,
}: ContactsViewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!contacts.length) {
    return (
      <div className="page-card">
        No contacts yet. Click <strong>Add Contact</strong> or{" "}
        <strong>Import CSV</strong>.
      </div>
    );
  }

  const q = search.trim().toLowerCase();

  const matches = (contact: ContactItem) =>
    !q ||
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(q);

  const toggleSection = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const sortedGroups = [...groups].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const ungrouped = contacts.filter((c) => c.groupIds.length === 0);

  const sections: Array<{ key: string; label: string; members: ContactItem[] }> =
    sortedGroups.map((g) => ({
      key: g.id,
      label: g.name,
      members: contacts.filter((c) => c.groupIds.includes(g.id)),
    }));

  if (ungrouped.length > 0) {
    sections.push({ key: "__ungrouped__", label: "Ungrouped", members: ungrouped });
  }

  const visibleSections = q
    ? sections.filter((s) => s.members.some(matches))
    : sections;

  if (q && visibleSections.length === 0) {
    return (
      <div className="page-card">No contacts match &ldquo;{search}&rdquo;.</div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {visibleSections.map((section) => {
        const isOpen = !!expanded[section.key] || !!q;
        const matchingMembers = section.members.filter(matches);
        const countLabel = q
          ? `${matchingMembers.length} / ${section.members.length}`
          : `${section.members.length}`;

        return (
          <div key={section.key} className="page-card" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {isOpen ? "▼" : "▶"}
              </span>
              <span style={{ fontWeight: 600 }}>{section.label}</span>
              <span
                style={{
                  marginLeft: "0.25rem",
                  background: "#e2e8f0",
                  borderRadius: 999,
                  padding: "0.1rem 0.5rem",
                  fontSize: "0.75rem",
                  color: "#475569",
                }}
              >
                {countLabel}
              </span>
            </button>

            {isOpen && (
              <div style={{ borderTop: "1px solid #e2e8f0" }}>
                {matchingMembers.length === 0 ? (
                  <p style={{ padding: "0.75rem 1rem", margin: 0, color: "#64748b" }}>
                    No contacts match &ldquo;{search}&rdquo;.
                  </p>
                ) : (
                  matchingMembers.map((contact) => (
                    <div
                      key={contact.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 1rem",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <span style={{ flex: 1 }}>
                        {contact.firstName} {contact.lastName}
                      </span>
                      <span style={{ flex: 1, color: "#475569", fontSize: "0.9rem" }}>
                        {contact.email}
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                        onClick={() => onEdit(contact)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{
                          padding: "0.25rem 0.6rem",
                          fontSize: "0.8rem",
                          color: "#c00",
                        }}
                        onClick={() => onDelete(contact)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
