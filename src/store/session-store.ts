import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  company_id: number;
  name: string;
  email: string;
  token: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoggedIn: () => boolean;
}

export const sessionStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      isLoggedIn: () => !!get().user?.token,
    }),
    {
      name: 'session-storage',
    }
  )
);