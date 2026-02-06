import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import type { Question, Attempt } from '@/types/reading';

interface ResultCardProps {
  question: Question;
  attempt: Attempt;
  questionNumber: number;
}

const questionTypeLabels: Record<string, string> = {
  mcq_main_idea: '🎯 Main Idea',
  mcq_detail: '🔍 Key Detail',
  short_answer: '✏️ Short Answer',
  mcq_vocab: '📝 Vocabulary',
};

export function ResultCard({ question, attempt, questionNumber }: ResultCardProps) {
  const isCorrect = attempt.is_correct;

  return (
    <div className={cn(
      'rounded-2xl p-5 border-2 transition-all',
      isCorrect 
        ? 'bg-success/10 border-success/30' 
        : 'bg-destructive/10 border-destructive/30'
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
        )}>
          {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-muted-foreground">
              Q{questionNumber}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {questionTypeLabels[question.question_type]}
            </span>
          </div>
          
          <p className="font-semibold text-foreground mb-3">{question.prompt}</p>
          
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-muted-foreground">Your answer: </span>
              <span className={cn(
                'font-semibold',
                isCorrect ? 'text-success' : 'text-destructive'
              )}>
                {attempt.child_answer}
              </span>
            </p>
            
            {/* For correct short answers, show encouraging message with model sentence */}
            {isCorrect && question.question_type === 'short_answer' && (
              <p className="text-success">
                <span className="font-medium">Nice job! </span>
                <span className="text-muted-foreground">A complete sentence could be: </span>
                <span className="font-semibold text-foreground">"{question.correct_answer}"</span>
              </p>
            )}
            
            {/* For incorrect answers, show the correct answer */}
            {!isCorrect && (
              <p>
                <span className="font-medium text-muted-foreground">Correct answer: </span>
                <span className="font-semibold text-success">{question.correct_answer}</span>
              </p>
            )}
            
            <p className="text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg">
              💡 {question.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
