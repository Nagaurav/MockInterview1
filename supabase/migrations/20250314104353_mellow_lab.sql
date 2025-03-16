/*
  # Initial Schema Setup for InterviewAI

  1. New Tables
    - `users`
      - Extended user profile data
      - Links with Supabase auth.users
    - `interviews`
      - Stores interview session data
    - `recordings`
      - Stores interview recording metadata
    - `feedback`
      - Stores AI feedback for interviews
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table for extended profile data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  interview_type text NOT NULL,
  difficulty_level text NOT NULL,
  duration interval,
  score integer CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid REFERENCES interviews(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  video_url text,
  transcript text,
  duration interval,
  created_at timestamptz DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid REFERENCES interviews(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  clarity_score integer CHECK (clarity_score >= 0 AND clarity_score <= 100),
  eye_contact_score integer CHECK (eye_contact_score >= 0 AND eye_contact_score <= 100),
  engagement_score integer CHECK (engagement_score >= 0 AND engagement_score <= 100),
  feedback_text text[],
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for interviews table
CREATE POLICY "Users can CRUD own interviews"
  ON interviews
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recordings table
CREATE POLICY "Users can CRUD own recordings"
  ON recordings
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for feedback table
CREATE POLICY "Users can CRUD own feedback"
  ON feedback
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();