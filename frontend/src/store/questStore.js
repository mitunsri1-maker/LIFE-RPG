import { create } from 'zustand';
import { questsApi } from '../api';
import toast from 'react-hot-toast';

export const useQuestStore = create((set, get) => ({
  quests: [],
  isLoading: false,
  error: null,
  lastReward: null,

  fetchQuests: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await questsApi.getAll(params);
      set({ quests: res.data.quests, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.error || 'Failed to load quests.' });
    }
  },

  createQuest: async (data) => {
    try {
      const res = await questsApi.create(data);
      set((state) => ({ quests: [res.data.quest, ...state.quests] }));
      toast.success('Quest created!');
      return { success: true, quest: res.data.quest };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create quest.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  updateQuest: async (id, data) => {
    try {
      const res = await questsApi.update(id, data);
      set((state) => ({
        quests: state.quests.map((q) => (q.id === id ? res.data.quest : q)),
      }));
      toast.success('Quest updated!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update quest.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  deleteQuest: async (id) => {
    try {
      await questsApi.delete(id);
      set((state) => ({ quests: state.quests.filter((q) => q.id !== id) }));
      toast.success('Quest deleted.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete quest.';
      toast.error(msg);
      return { success: false };
    }
  },

  completeQuest: async (id) => {
    try {
      const res = await questsApi.complete(id);
      set((state) => ({
        quests: state.quests.map((q) =>
          q.id === parseInt(id) ? { ...q, status: 'completed' } : q
        ),
        lastReward: res.data,
      }));
      return { success: true, reward: res.data };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to complete quest.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  clearLastReward: () => set({ lastReward: null }),
}));
