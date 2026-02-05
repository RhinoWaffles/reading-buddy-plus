import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Session, Question, Attempt, EvidenceSpan } from '@/types/reading';

export function useSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: async (session: Omit<Session, 'id' | 'user_id' | 'created_at'> & { questions: Omit<Question, 'id' | 'session_id'>[] }) => {
      if (!user) throw new Error('No user');
      
      const { questions, ...sessionData } = session;
      
      // Create the session
      const { data: newSession, error: sessionError } = await supabase
        .from('sessions')
        .insert({ ...sessionData, user_id: user.id })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      // Create the questions
      const questionsToInsert = questions.map(q => ({
        order_index: q.order_index,
        question_type: q.question_type,
        prompt: q.prompt,
        choices: q.choices,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        hint: q.hint,
        session_id: newSession.id,
        evidence_spans: q.evidence_spans,
      }));
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert as any);
      
      if (questionsError) throw questionsError;
      
      return newSession as Session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', user?.id] });
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Session> }) => {
      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', user?.id] });
    },
  });

  return { sessions, isLoading, createSession, updateSession };
}

export function useSessionDetails(sessionId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('session_id', sessionId)
        .order('order_index');
      
      if (questionsError) throw questionsError;
      
      const { data: attempts, error: attemptsError } = await supabase
        .from('attempts')
        .select('*')
        .eq('session_id', sessionId);
      
      if (attemptsError) throw attemptsError;
      
      return {
        session: session as Session,
        questions: questions.map(q => ({
          ...q,
          choices: q.choices as string[] | null,
          evidence_spans: (Array.isArray(q.evidence_spans) ? q.evidence_spans : []) as unknown as EvidenceSpan[],
        })) as Question[],
        attempts: attempts as Attempt[],
      };
    },
    enabled: !!sessionId,
  });

  return { data, isLoading };
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attempt: Omit<Attempt, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('attempts')
        .insert(attempt)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.session_id] });
    },
  });
}
