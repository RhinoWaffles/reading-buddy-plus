-- Settings table (single row for child info)
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_name text NOT NULL DEFAULT 'Reader',
  grade_level integer NOT NULL DEFAULT 3,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Sessions table (reading sessions)
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  passage_type text NOT NULL CHECK (passage_type IN ('fiction', 'nonfiction')),
  primary_skill_category text NOT NULL CHECK (primary_skill_category IN ('A', 'B', 'C', 'D')),
  passage_title text NOT NULL,
  passage_text text NOT NULL,
  reading_level text NOT NULL DEFAULT 'grade3',
  estimated_minutes integer NOT NULL DEFAULT 5,
  total_questions integer NOT NULL DEFAULT 4,
  correct_count integer DEFAULT 0,
  completed_at timestamp with time zone,
  is_seeded boolean NOT NULL DEFAULT false
);

-- Questions table
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  order_index integer NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('mcq_main_idea', 'mcq_detail', 'short_answer', 'mcq_vocab')),
  prompt text NOT NULL,
  choices jsonb,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  hint text,
  evidence_spans jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- Attempts table (child answers)
CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  child_answer text NOT NULL,
  is_correct boolean NOT NULL,
  seconds_spent integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Daily stats table
CREATE TABLE public.daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  sessions_completed integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  minutes_spent integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
CREATE POLICY "Users can view own settings"
  ON public.settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.settings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for sessions
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for questions (via session ownership)
CREATE POLICY "Users can view questions for own sessions"
  ON public.questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE sessions.id = questions.session_id 
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert questions for own sessions"
  ON public.questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE sessions.id = questions.session_id 
    AND sessions.user_id = auth.uid()
  ));

-- RLS Policies for attempts (via session ownership)
CREATE POLICY "Users can view attempts for own sessions"
  ON public.attempts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE sessions.id = attempts.session_id 
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert attempts for own sessions"
  ON public.attempts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE sessions.id = attempts.session_id 
    AND sessions.user_id = auth.uid()
  ));

-- RLS Policies for daily_stats
CREATE POLICY "Users can view own daily stats"
  ON public.daily_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily stats"
  ON public.daily_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily stats"
  ON public.daily_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update settings updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();