import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Interview } from '../types';
import { useAuth } from '../../App';

export function useInterviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setInterviews([]);
      setLoading(false);
      return;
    }

    async function fetchInterviews() {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInterviews(data || []);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, [user]);

  async function createInterview(interview: Omit<Interview, 'id' | 'created_at' | 'updated_at'>) {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({ ...interview, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setInterviews(prev => [data, ...prev]);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  }

  async function updateInterview(id: string, updates: Partial<Interview>) {
    try {
      const { error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setInterviews(prev =>
        prev.map(interview =>
          interview.id === id ? { ...interview, ...updates } : interview
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  }

  async function deleteInterview(id: string) {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setInterviews(prev => prev.filter(interview => interview.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  }

  return {
    interviews,
    loading,
    error,
    createInterview,
    updateInterview,
    deleteInterview,
  };
}