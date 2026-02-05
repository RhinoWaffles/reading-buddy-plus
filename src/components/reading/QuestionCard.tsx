import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Question } from '@/types/reading';
import { Lightbulb } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

const questionTypeLabels: Record<string, string> = {
  mcq_main_idea: '🎯 Main Idea',
  mcq_detail: '🔍 Key Detail',
  short_answer: '✏️ Short Answer',
  mcq_vocab: '📝 Vocabulary',
};

export function QuestionCard({ 
  question, 
  questionNumber,
  onAnswer,
  disabled = false
}: QuestionCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const isMultipleChoice = question.question_type !== 'short_answer';

  const handleSubmit = () => {
    if (isMultipleChoice && selectedChoice) {
      onAnswer(selectedChoice);
    } else if (!isMultipleChoice && shortAnswer.trim()) {
      onAnswer(shortAnswer.trim());
    }
  };

  const canSubmit = isMultipleChoice ? !!selectedChoice : shortAnswer.trim().length > 0;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          {questionNumber}
        </div>
        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-semibold">
          {questionTypeLabels[question.question_type]}
        </span>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-6">
        {question.prompt}
      </h3>

      {isMultipleChoice && question.choices ? (
        <div className="space-y-3">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => !disabled && setSelectedChoice(choice)}
              disabled={disabled}
              className={cn(
                'w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2',
                selectedChoice === choice
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-muted/50 border-transparent hover:bg-muted hover:border-muted-foreground/20',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-3 text-sm font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[120px] text-lg"
            disabled={disabled}
          />
          {question.hint && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="gap-2 text-muted-foreground"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </Button>
              {showHint && (
                <p className="mt-2 p-3 bg-accent/20 rounded-lg text-sm text-muted-foreground">
                  💡 {question.hint}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || disabled}
          className="w-full py-6 text-lg font-bold"
          size="lg"
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
}
