import { create } from 'zustand';
import { supabase } from '../supabase';

interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notification_preferences: {
    email: boolean;
    interview_reminders: boolean;
    performance_reports: boolean;
  };
  video_settings: {
    resolution: '720p' | '1080p';
    noise_cancellation: boolean;
  };
}

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      set({ settings: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (updates) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      await get().fetchSettings();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));