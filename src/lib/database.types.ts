export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      interviews: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          duration: string | null
          score: number | null
          video_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          duration?: string | null
          score?: number | null
          video_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          duration?: string | null
          score?: number | null
          video_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      feedback: {
        Row: {
          id: string
          interview_id: string
          user_id: string
          confidence_score: number | null
          clarity_score: number | null
          eye_contact_score: number | null
          engagement_score: number | null
          feedback_text: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          interview_id: string
          user_id: string
          confidence_score?: number | null
          clarity_score?: number | null
          eye_contact_score?: number | null
          engagement_score?: number | null
          feedback_text?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          interview_id?: string
          user_id?: string
          confidence_score?: number | null
          clarity_score?: number | null
          eye_contact_score?: number | null
          engagement_score?: number | null
          feedback_text?: string[] | null
          created_at?: string | null
        }
      }
      recordings: {
        Row: {
          id: string
          interview_id: string
          user_id: string
          video_url: string | null
          transcript: string | null
          duration: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          interview_id: string
          user_id: string
          video_url?: string | null
          transcript?: string | null
          duration?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          interview_id?: string
          user_id?: string
          video_url?: string | null
          transcript?: string | null
          duration?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}