import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface MindLabState {
  solvedFaces: Set<string>;
  incrementSolved: (faceId: string) => void;
  reset: () => void;
}

interface ChallengeState {
  cipherSolved: boolean;
  logicGridSolved: boolean;
  unlocked: boolean;
  setCipherSolved: () => void;
  setLogicGridSolved: () => void;
  setUnlocked: () => void;
  resetChallenge: () => void;
}

interface UIState {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  navShrunk: boolean;
  setNavShrunk: (shrunk: boolean) => void;
  mindLab: MindLabState;
  challenge: ChallengeState;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  setTheme: (mode) => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    set({ theme: mode });
  },
  toggleTheme: () =>
    set((state) => {
      const next: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),
  navShrunk: false,
  setNavShrunk: (shrunk) => set({ navShrunk: shrunk }),
  mindLab: {
    solvedFaces: new Set(),
    incrementSolved: (faceId: string) =>
      set((state) => {
        const next = new Set(state.mindLab.solvedFaces);
        next.add(faceId);
        return { mindLab: { ...state.mindLab, solvedFaces: next } };
      }),
    reset: () =>
      set((state) => ({
        mindLab: { ...state.mindLab, solvedFaces: new Set() },
      })),
  },
  challenge: {
    cipherSolved: false,
    logicGridSolved: false,
    unlocked: false,
    setCipherSolved: () =>
      set((state) => ({
        challenge: { ...state.challenge, cipherSolved: true },
      })),
    setLogicGridSolved: () =>
      set((state) => ({
        challenge: { ...state.challenge, logicGridSolved: true },
      })),
    setUnlocked: () =>
      set((state) => ({
        challenge: { ...state.challenge, unlocked: true },
      })),
    resetChallenge: () =>
      set((state) => ({
        challenge: {
          ...state.challenge,
          cipherSolved: false,
          logicGridSolved: false,
          unlocked: false,
        },
      })),
  },
}));
