import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Interview = {
  id: string;
  user_id: string;
  title: string;
  interview_type: string;
  difficulty_level: string;
  duration: string;
  score: number;
  created_at: string;
  updated_at: string;
};

export type Recording = {
  id: string;
  interview_id: string;
  user_id: string;
  video_url: string | null;
  transcript: string | null;
  duration: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  interview_id: string;
  user_id: string;
  confidence_score: number;
  clarity_score: number;
  eye_contact_score: number;
  engagement_score: number;
  feedback_text: string[];
  created_at: string;
};