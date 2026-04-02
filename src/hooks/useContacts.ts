import { useAppData } from '../state/AppDataContext';

export function useContacts() {
  const { contacts, addContact, importContacts, updateContactGroups } = useAppData();
  return {
    contacts,
    loading: false,
    addContact,
    importContacts,
    updateContactGroups
  };
}
