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
}

export const sessionStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'session-storage',
    }
  )
);