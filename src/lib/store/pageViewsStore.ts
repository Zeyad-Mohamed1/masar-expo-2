import { create } from "zustand";

interface PageViewsState {
  developerViewers: Record<string, number>;
  setDeveloperViewers: (developerName: string, count: number) => void;
  incrementDeveloperViewers: (developerName: string) => void;
  decrementDeveloperViewers: (developerName: string) => void;
}

export const usePageViewsStore = create<PageViewsState>()((set) => ({
  developerViewers: {},

  setDeveloperViewers: (developerName, count) =>
    set((state) => ({
      developerViewers: {
        ...state.developerViewers,
        [developerName]: count,
      },
    })),

  incrementDeveloperViewers: (developerName) =>
    set((state) => ({
      developerViewers: {
        ...state.developerViewers,
        [developerName]: (state.developerViewers[developerName] || 0) + 1,
      },
    })),

  decrementDeveloperViewers: (developerName) =>
    set((state) => ({
      developerViewers: {
        ...state.developerViewers,
        [developerName]: Math.max(
          0,
          (state.developerViewers[developerName] || 1) - 1,
        ),
      },
    })),
}));
