import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useAppData } from '../../state/AppDataContext';

export function GmailAuthSection() {
  const { settings, updateSettings } = useAppData();
  const [draftEmail, setDraftEmail] = useState(settings.gmailEmail);

  const handleConnect = (event: FormEvent) => {
    event.preventDefault();
    if (!draftEmail.trim()) return;
    updateSettings({ gmailEmail: draftEmail.trim(), gmailConnected: true });
  };

  return (
    <section className="page-card" style={{ marginBottom: '1rem' }}>
      <h3>Gmail</h3>
      <form onSubmit={handleConnect} style={{ display: 'grid', gap: '0.5rem' }}>
        <input
          placeholder="gmail@example.com"
          value={draftEmail}
          onChange={(event) => setDraftEmail(event.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button type="submit">{settings.gmailConnected ? 'Update Email' : 'Connect Gmail'}</Button>
          {settings.gmailConnected ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => updateSettings({ gmailConnected: false })}
            >
              Disconnect
            </Button>
          ) : null}
        </div>
      </form>
      <p style={{ marginBottom: 0 }}>
        Status: {settings.gmailConnected ? `Connected as ${settings.gmailEmail}` : 'Not connected'}
      </p>
    </section>
  );
}
