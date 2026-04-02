<<<<<<< HEAD
import { Button } from '../../components/ui/Button';

interface ComposePanelProps {
  subject: string;
  message: string;
  recipientCount: number;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onGenerate: () => void;
}

export function ComposePanel({
  subject,
  message,
  recipientCount,
  onSubjectChange,
  onMessageChange,
  onGenerate
}: ComposePanelProps) {
  return (
    <div className="page-card" style={{ display: 'grid', gap: '0.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Compose Email</h3>
      <input value={subject} onChange={(e) => onSubjectChange(e.target.value)} />
      <textarea rows={7} value={message} onChange={(e) => onMessageChange(e.target.value)} />
      <Button onClick={onGenerate}>Generate {recipientCount} Email Preview(s)</Button>
    </div>
  );
=======
export function ComposePanel() {
  return null;
>>>>>>> main
}
