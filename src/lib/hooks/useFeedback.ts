import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Feedback } from '../types';
import { useAuth } from '../../App';

export function useFeedback(interviewId?: string) {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !interviewId) {
      setFeedback([]);
      setLoading(false);
      return;
    }

    async function fetchFeedback() {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('interview_id', interviewId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedback(data || []);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [user, interviewId]);

  async function createFeedback(newFeedback: Omit<Feedback, 'id' | 'created_at'>) {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({ ...newFeedback, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setFeedback(prev => [data, ...prev]);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  }

  return {
    feedback,
    loading,
    error,
    createFeedback,
  };
}