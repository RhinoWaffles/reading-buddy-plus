import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PassageDisplay } from '@/components/reading/PassageDisplay';
import { ResultCard } from '@/components/reading/ResultCard';
import { StarAnimation } from '@/components/ui/StarAnimation';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Button } from '@/components/ui/button';
import { useSessionDetails } from '@/hooks/useSessions';
import { Loader2, RotateCcw, Home, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { EvidenceSpan } from '@/types/reading';

export default function Results() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useSessionDetails(sessionId || null);
  const [showStars, setShowStars] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setTimeout(() => setShowStars(true), 500);
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const { session, questions, attempts } = data;
  const correctCount = attempts.filter(a => a.is_correct).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 100) return { emoji: '🏆', text: 'Perfect!' };
    if (percentage >= 75) return { emoji: '🌟', text: 'Great Job!' };
    if (percentage >= 50) return { emoji: '👍', text: 'Good Work!' };
    return { emoji: '💪', text: 'Keep Trying!' };
  };

  const grade = getGrade();

  // Get evidence spans for selected question
  const getEvidenceSpans = (): EvidenceSpan[] => {
    if (selectedQuestionIndex === null) return [];
    return questions[selectedQuestionIndex]?.evidence_spans || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Results Header */}
        <div className="bg-card rounded-3xl p-8 shadow-card text-center mb-6">
          <div className="mb-4">
            <StarAnimation count={correctCount >= 3 ? 3 : correctCount >= 2 ? 2 : 1} show={showStars} />
          </div>
          
          <h1 className="text-4xl mb-2">{grade.emoji}</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">{grade.text}</h2>
          
          <div className="flex justify-center mb-6">
            <ProgressRing progress={percentage} size={140} strokeWidth={10}>
              <div className="text-center">
                <span className="text-3xl font-bold text-foreground">{correctCount}</span>
                <span className="text-lg text-muted-foreground">/{totalQuestions}</span>
                <p className="text-xs text-muted-foreground">correct</p>
              </div>
            </ProgressRing>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="font-medium">+{correctCount * 10} points earned!</span>
          </div>
        </div>

        {/* Passage with evidence highlighting */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {selectedQuestionIndex !== null 
              ? '👆 Evidence highlighted for the selected question'
              : '👇 Click a question to see evidence in the passage'
            }
          </p>
          <PassageDisplay
            title={session.passage_title}
            text={session.passage_text}
            passageType={session.passage_type}
            evidenceSpans={getEvidenceSpans()}
            showEvidence={selectedQuestionIndex !== null}
          />
        </div>

        {/* Question Results */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-foreground">Your Answers</h3>
          {questions.map((question, index) => {
            const attempt = attempts.find(a => a.question_id === question.id);
            if (!attempt) return null;
            
            return (
              <div 
                key={question.id}
                onClick={() => setSelectedQuestionIndex(selectedQuestionIndex === index ? null : index)}
                className={`cursor-pointer transition-all ${
                  selectedQuestionIndex === index ? 'ring-2 ring-primary ring-offset-2 rounded-2xl' : ''
                }`}
              >
                <ResultCard
                  question={question}
                  attempt={attempt}
                  questionNumber={index + 1}
                />
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate('/session')}
            size="lg"
            className="flex-1 py-6 text-lg font-bold gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Do Another 5 Minutes
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="flex-1 py-6 text-lg font-bold gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
