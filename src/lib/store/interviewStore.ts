import { create } from 'zustand';
import { supabase } from '../supabase';
import { InterviewSession, InterviewType, DifficultyLevel, AIFeedback } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface InterviewState {
  currentSession: InterviewSession | null;
  feedback: AIFeedback | null;
  isRecording: boolean;
  transcription: string;
  loading: boolean;
  error: string | null;
  startSession: (type: InterviewType, difficulty: DifficultyLevel) => Promise<void>;
  endSession: () => Promise<void>;
  updateFeedback: (feedback: AIFeedback) => Promise<void>;
  setRecording: (isRecording: boolean) => void;
  updateTranscription: (text: string) => void;
  saveRecording: (videoBlob: Blob) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentSession: null,
  feedback: null,
  isRecording: false,
  transcription: '',
  loading: false,
  error: null,

  startSession: async (type, difficulty) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const sessionId = uuidv4();
      const { error } = await supabase
        .from('interviews')
        .insert({
          id: sessionId,
          user_id: user.id,
          type,
          difficulty_level: difficulty,
          title: `${type} Interview - ${new Date().toLocaleDateString()}`,
        });

      if (error) throw error;

      set({
        currentSession: {
          id: sessionId,
          type,
          difficulty,
          currentQuestion: 1,
          totalQuestions: 10,
          startTime: new Date(),
          score: 0,
        },
        feedback: null,
        transcription: '',
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  endSession: async () => {
    set({ loading: true, error: null });
    try {
      const session = get().currentSession;
      if (!session) return;

      const endTime = new Date();
      const duration = endTime.getTime() - session.startTime.getTime();

      const { error } = await supabase
        .from('interviews')
        .update({
          duration: `${Math.floor(duration / 1000)} seconds`,
          score: session.score,
          updated_at: endTime.toISOString(),
        })
        .eq('id', session.id);

      if (error) throw error;

      set({
        currentSession: null,
        feedback: null,
        isRecording: false,
        transcription: '',
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateFeedback: async (feedback) => {
    set({ loading: true, error: null });
    try {
      const session = get().currentSession;
      if (!session) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('feedback')
        .insert({
          interview_id: session.id,
          user_id: user.id,
          confidence_score: feedback.confidenceScore,
          clarity_score: feedback.clarityScore,
          eye_contact_score: feedback.eyeContactScore,
          engagement_score: feedback.engagementScore,
          feedback_text: feedback.feedback,
        });

      if (error) throw error;
      set({ feedback });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  setRecording: (isRecording) => set({ isRecording }),

  updateTranscription: (text) => set((state) => ({
    transcription: state.transcription + ' ' + text,
  })),

  saveRecording: async (videoBlob: Blob) => {
    set({ loading: true, error: null });
    try {
      const session = get().currentSession;
      if (!session) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const filename = `${user.id}/${session.id}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('interview-recordings')
        .upload(filename, videoBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('interview-recordings')
        .getPublicUrl(filename);

      const { error: recordingError } = await supabase
        .from('recordings')
        .insert({
          interview_id: session.id,
          user_id: user.id,
          video_url: publicUrl,
          transcript: get().transcription,
        });

      if (recordingError) throw recordingError;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));