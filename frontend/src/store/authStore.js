import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(credentials);
          const { token, user } = res.data;
          localStorage.setItem('life_rpg_token', token);
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.error || 'Login failed.';
          set({ isLoading: false, error: msg });
          return { success: false, error: msg };
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.signup(data);
          const { token, user } = res.data;
          localStorage.setItem('life_rpg_token', token);
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.error || 'Signup failed.';
          set({ isLoading: false, error: msg });
          return { success: false, error: msg };
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch (_) {}
        localStorage.removeItem('life_rpg_token');
        set({ user: null, token: null });
      },

      refreshUser: async () => {
        try {
          const res = await authApi.me();
          set({ user: res.data.user });
        } catch (_) {}
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    { name: 'life_rpg_auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
