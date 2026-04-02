<<<<<<< HEAD
import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useAppData } from '../../state/AppDataContext';

export function BrandingSection() {
  const { settings, updateSettings } = useAppData();
  const [appName, setAppName] = useState(settings.appName);

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    if (!appName.trim()) return;
    updateSettings({ appName: appName.trim() });
  };

  return (
    <section className="page-card">
      <h3>Branding</h3>
      <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.5rem' }}>
        <input value={appName} onChange={(event) => setAppName(event.target.value)} placeholder="App Name" />
        <Button type="submit">Save Branding</Button>
      </form>
      <p style={{ marginBottom: 0 }}>Current app name: {settings.appName}</p>
=======
export function BrandingSection() {
  return (
    <section className="page-card">
      <h3>Branding</h3>
      <p>App name and email footer settings will be stored at settings/app.</p>
>>>>>>> main
    </section>
  );
}
