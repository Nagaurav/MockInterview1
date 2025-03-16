import { create } from 'zustand';
import { supabase } from '../supabase';

interface CustomMode {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  settings: Record<string, any>;
}

interface CustomModesState {
  modes: CustomMode[];
  loading: boolean;
  error: string | null;
  fetchModes: () => Promise<void>;
  createMode: (mode: Omit<CustomMode, 'id'>) => Promise<void>;
  updateMode: (id: string, updates: Partial<CustomMode>) => Promise<void>;
  deleteMode: (id: string) => Promise<void>;
}

export const useCustomModesStore = create<CustomModesState>((set, get) => ({
  modes: [],
  loading: false,
  error: null,

  fetchModes: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('custom_modes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ modes: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createMode: async (mode) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('custom_modes')
        .insert([mode]);

      if (error) throw error;
      await get().fetchModes();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateMode: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('custom_modes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchModes();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteMode: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('custom_modes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchModes();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));