import { Session } from "next-auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,
      session: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setSession: (session) =>
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        }),

      setError: (error) => set({ error }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        }),

      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });

          // Fetch session from next-auth
          const response = await fetch("/api/auth/session");
          const session = await response.json();

          if (session && session.user) {
            set({
              session,
              user: session.user,
              isAuthenticated: true,
            });
            return true;
          } else {
            set({
              session: null,
              user: null,
              isAuthenticated: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: "Authentication check failed",
            isAuthenticated: false,
          });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "user-storage",
      // Only store non-sensitive data in localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
