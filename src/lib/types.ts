import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Interview = Database['public']['Tables']['interviews']['Row'];
export type Recording = Database['public']['Tables']['recordings']['Row'];
export type Feedback = Database['public']['Tables']['feedback']['Row'];

export type InterviewType = 'technical' | 'behavioral' | 'general' | 'case_study';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface InterviewSession {
  id: string;
  type: InterviewType;
  difficulty: DifficultyLevel;
  currentQuestion: number;
  totalQuestions: number;
  startTime: Date;
  endTime?: Date;
  score?: number;
  feedback?: Feedback;
}

export interface AIFeedback {
  confidenceScore: number;
  clarityScore: number;
  eyeContactScore: number;
  engagementScore: number;
  feedback: string[];
  timestamp: Date;
}

export interface InterviewQuestion {
  id: string;
  type: InterviewType;
  difficulty: DifficultyLevel;
  question: string;
  expectedDuration: number;
  category: string;
  subcategory?: string;
}