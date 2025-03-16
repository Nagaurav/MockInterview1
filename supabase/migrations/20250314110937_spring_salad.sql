/*
  # Enhanced Schema for InterviewAI

  1. Updates
    - Add difficulty_level to interviews table
    - Add interview_type to interviews table
    - Add performance metrics to feedback table
    - Add settings table for user preferences
    
  2. Security
    - Update RLS policies
    - Add new policies for settings table
*/

-- Add new columns to interviews table
ALTER TABLE interviews
ADD COLUMN IF NOT EXISTS difficulty_level text NOT NULL DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS interview_type text NOT NULL DEFAULT 'general';

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  theme text DEFAULT 'light',
  language text DEFAULT 'en',
  notification_preferences jsonb DEFAULT '{"email": true, "interview_reminders": true, "performance_reports": true}'::jsonb,
  video_settings jsonb DEFAULT '{"resolution": "1080p", "noise_cancellation": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add performance metrics to feedback table
ALTER TABLE feedback
ADD COLUMN IF NOT EXISTS speech_rate integer CHECK (speech_rate >= 0 AND speech_rate <= 100),
ADD COLUMN IF NOT EXISTS response_quality integer CHECK (response_quality >= 0 AND response_quality <= 100),
ADD COLUMN IF NOT EXISTS answer_structure integer CHECK (answer_structure >= 0 AND answer_structure <= 100);

-- Enable RLS on settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings table
CREATE POLICY "Users can manage their own settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update interview policies to include type and difficulty
CREATE POLICY "Users can filter interviews by type and difficulty"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    AND (
      interview_type = current_setting('app.current_interview_type', true)
      OR current_setting('app.current_interview_type', true) IS NULL
    )
    AND (
      difficulty_level = current_setting('app.current_difficulty_level', true)
      OR current_setting('app.current_difficulty_level', true) IS NULL
    )
  );

-- Add function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();