-- Add DELETE policies for reset functionality

-- Allow users to delete their own sessions
CREATE POLICY "Users can delete own sessions"
ON public.sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete attempts for their own sessions
CREATE POLICY "Users can delete attempts for own sessions"
ON public.attempts
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM sessions
  WHERE sessions.id = attempts.session_id
  AND sessions.user_id = auth.uid()
));

-- Allow users to delete questions for their own sessions
CREATE POLICY "Users can delete questions for own sessions"
ON public.questions
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM sessions
  WHERE sessions.id = questions.session_id
  AND sessions.user_id = auth.uid()
));

-- Allow users to delete their own daily stats
CREATE POLICY "Users can delete own daily stats"
ON public.daily_stats
FOR DELETE
USING (auth.uid() = user_id);