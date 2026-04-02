import { Modal } from "../../components/ui/Modal";

interface PreviewItem {
  contactName: string;
  to: string;
  subject: string;
  qrDataUrl: string;
  qrLink: string;
}

interface EmailPreviewModalProps {
  open: boolean;
  previews: PreviewItem[];
  onClose: () => void;
}

export function EmailPreviewModal({
  open,
  previews,
  onClose,
}: EmailPreviewModalProps) {
  return (
    <Modal open={open} title="Email Preview" onClose={onClose}>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          maxHeight: 420,
          overflowY: "auto",
        }}
      >
        {previews.map((preview) => (
          <article
            key={preview.to}
            className="page-card"
            style={{ padding: "0.75rem" }}
          >
            <p style={{ margin: "0 0 0.25rem 0" }}>
              <strong>To:</strong> {preview.to}
            </p>
            <p style={{ margin: "0 0 0.25rem 0" }}>
              <strong>Contact:</strong> {preview.contactName}
            </p>
            <p style={{ margin: "0 0 0.25rem 0" }}>
              <strong>Subject:</strong> {preview.subject}
            </p>
            <a href={preview.qrLink} target="_blank" rel="noreferrer">
              {preview.qrLink}
            </a>
            <div>
              <img
                src={preview.qrDataUrl}
                alt={`QR for ${preview.contactName}`}
                style={{ width: 120, marginTop: "0.5rem" }}
              />
            </div>
          </article>
        ))}
      </div>
    </Modal>
  );
}
