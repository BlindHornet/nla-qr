import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface GroupItem {
  id: string;
  name: string;
  description: string;
  expiresAt?: string;
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
  loading: boolean;
  addGroup: (payload: { name: string; description: string; expiresAt?: string }) => Promise<void>;
  updateGroup: (id: string, payload: { name: string; description: string; expiresAt?: string }) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  addContact: (payload: { firstName: string; lastName: string; email: string; groupIds: string[] }) => Promise<void>;
  importContacts: (rows: CSVRow[], groupId?: string) => Promise<void>;
  updateContactGroups: (contactId: string, groupIds: string[]) => Promise<void>;
  updateSettings: (next: Partial<AppSettings>) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: PropsWithChildren) {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'NLA QR',
    gmailEmail: '',
    gmailConnected: false,
  });
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [contactsLoaded, setContactsLoaded] = useState(false);

  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map((d) => d.data() as GroupItem));
      setGroupsLoaded(true);
    });
    const unsubContacts = onSnapshot(collection(db, 'contacts'), (snap) => {
      setContacts(snap.docs.map((d) => d.data() as ContactItem));
      setContactsLoaded(true);
    });
    return () => {
      unsubGroups();
      unsubContacts();
    };
  }, []);

  const loading = !groupsLoaded || !contactsLoaded;

  const value = useMemo<AppDataContextValue>(
    () => ({
      contacts,
      groups,
      settings,
      loading,
      addGroup: async ({ name, description, expiresAt }) => {
        const id = crypto.randomUUID();
        const data: GroupItem = { id, name, description };
        if (expiresAt) data.expiresAt = expiresAt;
        await setDoc(doc(db, 'groups', id), data);
      },
      updateGroup: async (id, payload) => {
        await updateDoc(doc(db, 'groups', id), {
          name: payload.name,
          description: payload.description,
          expiresAt: payload.expiresAt ?? deleteField(),
        });
      },
      deleteGroup: async (id) => {
        const batch = writeBatch(db);
        batch.delete(doc(db, 'groups', id));
        for (const contact of contacts) {
          if (contact.groupIds.includes(id)) {
            batch.update(doc(db, 'contacts', contact.id), {
              groupIds: contact.groupIds.filter((gid) => gid !== id),
            });
          }
        }
        await batch.commit();
      },
      addContact: async ({ firstName, lastName, email, groupIds }) => {
        const id = crypto.randomUUID();
        await setDoc(doc(db, 'contacts', id), { id, firstName, lastName, email, groupIds });
      },
      importContacts: async (rows, groupId) => {
        const batch = writeBatch(db);
        for (const row of rows) {
          const id = crypto.randomUUID();
          batch.set(doc(db, 'contacts', id), {
            id,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            groupIds: groupId ? [groupId] : [],
          });
        }
        await batch.commit();
      },
      updateContactGroups: async (contactId, groupIds) => {
        await updateDoc(doc(db, 'contacts', contactId), { groupIds });
      },
      updateSettings: (next) => {
        setSettings((current) => ({ ...current, ...next }));
      },
    }),
    [contacts, groups, settings, loading]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
