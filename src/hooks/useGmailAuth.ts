<<<<<<< HEAD
import { useAppData } from '../state/AppDataContext';

export function useGmailAuth() {
  const { settings, updateSettings } = useAppData();

  return {
    connected: settings.gmailConnected,
    gmailEmail: settings.gmailEmail,
    connect: (gmailEmail: string) => updateSettings({ gmailConnected: true, gmailEmail }),
    disconnect: () => updateSettings({ gmailConnected: false })
=======
export function useGmailAuth() {
  return {
    connected: false,
    gmailEmail: null
>>>>>>> main
  };
}
