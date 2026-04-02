import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export interface GroupItem {
  id: string;
  name: string;
  description: string;
  expiresAt?: string; // ISO date string e.g. "2026-06-01"
}

export interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  groupIds: string[];
}

interface CSVRow {
  firstName: string;
  lastName: string;
  email: string;
}

interface AppSettings {
  appName: string;
  gmailEmail: string;
  gmailConnected: boolean;
}

interface AppDataContextValue {
  contacts: ContactItem[];
  groups: GroupItem[];
  settings: AppSettings;
  addGroup: (payload: { name: string; description: string }) => void;
  updateGroup: (id: string, payload: { name: string; description: string; expiresAt?: string }) => void;
  deleteGroup: (id: string) => void;
  addContact: (payload: { firstName: string; lastName: string; email: string; groupIds: string[] }) => void;
  importContacts: (rows: CSVRow[], groupId?: string) => void;
  updateContactGroups: (contactId: string, groupIds: string[]) => void;
  updateSettings: (next: Partial<AppSettings>) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const initialGroups: GroupItem[] = [
  { id: 'g-parents', name: 'Parents', description: 'Default parent group' },
  { id: 'g-teachers', name: 'Teachers', description: 'Default teacher group' }
];

export function AppDataProvider({ children }: PropsWithChildren) {
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'NLA QR',
    gmailEmail: '',
    gmailConnected: false
  });

  const value = useMemo<AppDataContextValue>(
    () => ({
      contacts,
      groups,
      settings,
      addGroup: ({ name, description }) => {
        setGroups((current) => [...current, { id: crypto.randomUUID(), name, description }]);
      },
      updateGroup: (id, payload) => {
        setGroups((current) =>
          current.map((group) => (group.id === id ? { ...group, ...payload } : group))
        );
      },
      deleteGroup: (id) => {
        setGroups((current) => current.filter((group) => group.id !== id));
        setContacts((current) =>
          current.map((contact) => ({
            ...contact,
            groupIds: contact.groupIds.filter((gid) => gid !== id),
          }))
        );
      },
      addContact: ({ firstName, lastName, email, groupIds }) => {
        setContacts((current) => [
          ...current,
          { id: crypto.randomUUID(), firstName, lastName, email, groupIds }
        ]);
      },
      importContacts: (rows, groupId) => {
        setContacts((current) => [
          ...current,
          ...rows.map((row) => ({
            id: crypto.randomUUID(),
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            groupIds: groupId ? [groupId] : []
          }))
        ]);
      },
      updateContactGroups: (contactId, groupIds) => {
        setContacts((current) =>
          current.map((contact) => (contact.id === contactId ? { ...contact, groupIds } : contact))
        );
      },
      updateSettings: (next) => {
        setSettings((current) => ({ ...current, ...next }));
      }
    }),
    [contacts, groups, settings]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
