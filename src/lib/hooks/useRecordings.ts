import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Recording } from '../types';
import { useAuth } from '../../App';

export function useRecordings(interviewId?: string) {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setRecordings([]);
      setLoading(false);
      return;
    }

    const fetchRecordings = async () => {
      try {
        let query = supabase
          .from('recordings')
          .select(`
            *,
            interviews (
              title,
              type,
              score
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (interviewId) {
          query = query.eq('interview_id', interviewId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to include interview details
        const transformedData = data.map(recording => ({
          ...recording,
          title: recording.interviews.title,
          type: recording.interviews.type,
          score: recording.interviews.score,
        }));

        setRecordings(transformedData);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription
    const subscription = supabase
      .channel('recordings_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recordings',
        filter: `user_id=eq.${user.id}`,
      }, 
      async (payload) => {
        // Refresh the recordings when changes occur
        await fetchRecordings();
      })
      .subscribe();

    fetchRecordings();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, interviewId]);

  const createRecording = async (recording: Omit<Recording, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recordings')
        .insert({ ...recording, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  };

  const deleteRecording = async (id: string) => {
    try {
      // First, get the recording to check if it has a video_url
      const { data: recording } = await supabase
        .from('recordings')
        .select('video_url')
        .eq('id', id)
        .single();

      // If there's a video file, delete it from storage
      if (recording?.video_url) {
        const path = recording.video_url.split('/').pop();
        if (path) {
          const { error: storageError } = await supabase.storage
            .from('interview-recordings')
            .remove([path]);

          if (storageError) throw storageError;
        }
      }

      // Delete the recording record
      const { error } = await supabase
        .from('recordings')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setRecordings(prev => prev.filter(recording => recording.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    }
  };

  return {
    recordings,
    loading,
    error,
    createRecording,
    deleteRecording,
  };
}