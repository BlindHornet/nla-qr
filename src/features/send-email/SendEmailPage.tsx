import { useMemo, useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { useAppData } from "../../state/AppDataContext";
import { toQRCodeDataUrl } from "../../lib/qrcode";
import { ComposePanel } from "./ComposePanel";
import { EmailPreviewModal } from "./EmailPreviewModal";
import { GroupRecipientPanel } from "./GroupRecipientPanel";
import { IndividualRecipientPanel } from "./IndividualRecipientPanel";

type Mode = "group" | "individual";

interface PreviewItem {
  contactName: string;
  to: string;
  subject: string;
  qrDataUrl: string;
  qrLink: string;
}

export function SendEmailPage() {
  const { contacts, groups, settings } = useAppData();
  const activeGroups = groups.filter(
    (group) => !group.expiresAt || new Date(group.expiresAt) >= new Date()
  );
  const [mode, setMode] = useState<Mode>("group");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState(
    "Your Family QR Code — {Last Name} Family",
  );
  const [message, setMessage] = useState(
    "Please use your attached QR code when arriving on campus.",
  );
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [openPreview, setOpenPreview] = useState(false);

  const selectedContacts = useMemo(
    () => contacts.filter((contact) => selectedIds.includes(contact.id)),
    [contacts, selectedIds],
  );

  const toggleRecipient = (contactId: string) => {
    setSelectedIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId],
    );
  };

  const handleGeneratePreview = async () => {
    const items = await Promise.all(
      selectedContacts.map(async (contact) => {
        const qrId = crypto.randomUUID();
        const qrLink = `https://yourproject.web.app/qr/${qrId}`;
        return {
          contactName: `${contact.firstName} ${contact.lastName}`,
          to: contact.email,
          subject: subject.replace("{Last Name}", contact.lastName),
          qrLink,
          qrDataUrl: await toQRCodeDataUrl(qrLink),
        };
      }),
    );
    setPreviews(items);
    setOpenPreview(true);
  };

  const canSend = settings.gmailConnected && selectedContacts.length > 0;

  return (
    <div>
      <PageHeader
        title="Send Email"
        subtitle="Select groups or individual contacts and generate QR email previews."
      />
      {!settings.gmailConnected ? (
        <p className="page-card">
          Connect Gmail in Settings first to enable sending.
        </p>
      ) : null}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <Button
          variant={mode === "group" ? "primary" : "secondary"}
          onClick={() => setMode("group")}
        >
          Group Mode
        </Button>
        <Button
          variant={mode === "individual" ? "primary" : "secondary"}
          onClick={() => setMode("individual")}
        >
          Individual Mode
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "0.75rem",
        }}
      >
        {mode === "group" ? (
          <GroupRecipientPanel
            groups={activeGroups}
            contacts={contacts}
            selectedGroupId={selectedGroupId}
            selectedIds={selectedIds}
            onSelectGroup={(groupId) => {
              setSelectedGroupId(groupId);
              const memberIds = contacts
                .filter((c) => c.groupIds.includes(groupId))
                .map((c) => c.id);
              setSelectedIds(memberIds);
            }}
            onToggleRecipient={toggleRecipient}
            onSelectAll={() => {
              const memberIds = contacts
                .filter((c) => c.groupIds.includes(selectedGroupId))
                .map((c) => c.id);
              setSelectedIds(memberIds);
            }}
            onDeselectAll={() => setSelectedIds([])}
          />
        ) : (
          <IndividualRecipientPanel
            contacts={contacts}
            search={search}
            selectedIds={selectedIds}
            onSearchChange={setSearch}
            onToggleRecipient={toggleRecipient}
          />
        )}
        <ComposePanel
          subject={subject}
          message={message}
          recipientCount={selectedContacts.length}
          onSubjectChange={setSubject}
          onMessageChange={setMessage}
          onGenerate={handleGeneratePreview}
        />
      </div>
      <p style={{ marginBottom: "0.5rem" }}>
        Send status:{" "}
        {canSend
          ? `Ready to send to ${selectedContacts.length} recipients`
          : "Select recipients and connect Gmail"}
      </p>
      <EmailPreviewModal
        open={openPreview}
        previews={previews}
        onClose={() => setOpenPreview(false)}
      />
    </div>
  );
}
