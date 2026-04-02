<<<<<<< HEAD
import { useAppData } from '../state/AppDataContext';

export function useGroups() {
  const { groups, addGroup } = useAppData();
  return {
    groups,
    loading: false,
    addGroup
=======
export function useGroups() {
  return {
    groups: [],
    loading: false
>>>>>>> main
  };
}
