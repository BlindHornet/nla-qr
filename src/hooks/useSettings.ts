import { useAppData } from "../state/AppDataContext";

export function useSettings() {
  const { settings, updateSettings } = useAppData();
  return {
    settings,
    loading: false,
    updateSettings,
  };
}
