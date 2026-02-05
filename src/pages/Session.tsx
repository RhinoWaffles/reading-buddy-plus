import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PassageDisplay } from '@/components/reading/PassageDisplay';
import { QuestionCard } from '@/components/reading/QuestionCard';
import { Button } from '@/components/ui/button';
import { useSessions, useSubmitAttempt } from '@/hooks/useSessions';
import { useDailyStats } from '@/hooks/useDailyStats';
import { SEEDED_SESSIONS } from '@/data/seeded-sessions';
import { Loader2, Clock } from 'lucide-react';
import type { Question, GeneratedSession, EvidenceSpan } from '@/types/reading';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SessionPhase = 'loading' | 'reading' | 'questions' | 'complete';

export default function Session() {
  const navigate = useNavigate();
  const { createSession, sessions } = useSessions();
  const submitAttempt = useSubmitAttempt();
  const { recordSessionComplete } = useDailyStats();
  const { toast } = useToast();

  const [phase, setPhase] = useState<SessionPhase>('loading');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<GeneratedSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const questionStartTime = useRef(Date.now());
  const [correctCount, setCorrectCount] = useState(0);

  // Generate or pick a session on mount
  useEffect(() => {
    generateSession();
  }, []);

  const generateSession = async () => {
    setPhase('loading');
    
    // Try AI generation first
    try {
      const { data, error } = await supabase.functions.invoke('generate-passage', {
        body: { difficulty: 'normal' }
      });

      if (!error && data?.passage_title) {
        setSessionData(data as GeneratedSession);
        await saveAndStartSession(data as GeneratedSession);
        return;
      }
    } catch (e) {
      console.log('AI generation failed, using seeded session');
    }

    // Fall back to seeded sessions
    const usedTitles = sessions?.map(s => s.passage_title) || [];
    const availableSessions = SEEDED_SESSIONS.filter(s => !usedTitles.includes(s.passage_title));
    const sessionPool = availableSessions.length > 0 ? availableSessions : SEEDED_SESSIONS;
    
    const randomSession = sessionPool[Math.floor(Math.random() * sessionPool.length)];
    setSessionData(randomSession);
    await saveAndStartSession(randomSession);
  };

  const saveAndStartSession = async (data: GeneratedSession) => {
    try {
      const newSession = await createSession.mutateAsync({
        passage_type: data.passage_type,
        primary_skill_category: data.primary_skill_category,
        passage_title: data.passage_title,
        passage_text: data.passage_text,
        reading_level: data.reading_level,
        estimated_minutes: 5,
        total_questions: 4,
        correct_count: 0,
        is_seeded: true,
        questions: data.questions,
      });

      setCurrentSessionId(newSession.id!);
      
      // Fetch the created questions
      const { data: createdQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('session_id', newSession.id!)
        .order('order_index');

      if (createdQuestions) {
        setQuestions(createdQuestions.map(q => ({
          ...q,
          choices: q.choices as string[] | null,
          evidence_spans: (Array.isArray(q.evidence_spans) ? q.evidence_spans : []) as unknown as EvidenceSpan[],
        })) as Question[]);
      }

      setPhase('reading');
    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        title: "Oops!",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartQuestions = () => {
    setPhase('questions');
    questionStartTime.current = Date.now();
  };

  const handleAnswer = async (answer: string) => {
    if (!currentSessionId || !questions[currentQuestionIndex]) return;

    const question = questions[currentQuestionIndex];
    const isCorrect = answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
    const secondsSpent = Math.round((Date.now() - questionStartTime.current) / 1000);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Submit the attempt
    await submitAttempt.mutateAsync({
      session_id: currentSessionId,
      question_id: question.id!,
      child_answer: answer,
      is_correct: isCorrect,
      seconds_spent: secondsSpent,
    });

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      questionStartTime.current = Date.now();
    } else {
      await completeSession();
    }
  };

  const completeSession = async () => {
    if (!currentSessionId) return;

    const totalMinutes = Math.round((Date.now() - startTime) / 60000);
    const finalCorrectCount = correctCount + (submitAttempt.data?.is_correct ? 0 : 0); // Already counted

    // Update session as complete
    await supabase
      .from('sessions')
      .update({ 
        completed_at: new Date().toISOString(),
        correct_count: correctCount + 1 // +1 for the last question if correct
      })
      .eq('id', currentSessionId);

    // Record stats
    await recordSessionComplete.mutateAsync({
      correctCount: correctCount,
      totalCount: 4,
      minutes: Math.max(totalMinutes, 1),
    });

    navigate(`/results/${currentSessionId}`);
  };

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Preparing your reading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Timer indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 text-muted-foreground">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">5 Minute Session</span>
        </div>

        {/* Progress indicator */}
        {phase === 'questions' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {correctCount} correct so far
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Passage Display */}
        {sessionData && (
          <PassageDisplay
            title={sessionData.passage_title}
            text={sessionData.passage_text}
            passageType={sessionData.passage_type}
          />
        )}

        {/* Reading Phase - Continue Button */}
        {phase === 'reading' && (
          <div className="mt-6">
            <Button
              onClick={handleStartQuestions}
              size="lg"
              className="w-full py-6 text-lg font-bold"
            >
              I'm Ready for Questions! 📝
            </Button>
          </div>
        )}

        {/* Questions Phase */}
        {phase === 'questions' && questions[currentQuestionIndex] && (
          <div className="mt-6">
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              onAnswer={handleAnswer}
              disabled={submitAttempt.isPending}
            />
          </div>
        )}
      </main>
    </div>
  );
}
