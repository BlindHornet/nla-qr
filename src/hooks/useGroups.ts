import { useAppData } from "../state/AppDataContext";

export function useGroups() {
  const { groups, addGroup, updateGroup, deleteGroup } = useAppData();
  return {
    groups,
    loading: false,
    addGroup,
    updateGroup,
    deleteGroup,
  };
}
