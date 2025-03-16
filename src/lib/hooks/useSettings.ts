import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../App';

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

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [user]);

  async function updateSettings(updates: Partial<Settings>) {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', settings.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}