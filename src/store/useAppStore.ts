import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  navVisible: boolean;
  setLoading: (loading: boolean) => void;
  setNavVisible: (visible: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  navVisible: true,
  setLoading: (isLoading) => set({ isLoading }),
  setNavVisible: (navVisible) => set({ navVisible }),
}));
