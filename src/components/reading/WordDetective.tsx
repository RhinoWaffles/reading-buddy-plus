import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface WordDetectiveQuestion {
  sentence: string;
  prompt: string;
  target_word: string;
  word_type: 'noun' | 'verb' | 'adjective' | 'conjunction';
  feedback: string;
}

const WORD_TYPE_COLORS: Record<string, string> = {
  noun: 'bg-[hsl(262_80%_60%/0.2)] text-[hsl(262,80%,40%)] border-[hsl(262,80%,60%)]',
  verb: 'bg-[hsl(200_85%_50%/0.2)] text-[hsl(200,85%,35%)] border-[hsl(200,85%,50%)]',
  adjective: 'bg-[hsl(145_65%_42%/0.2)] text-[hsl(145,65%,30%)] border-[hsl(145,65%,42%)]',
  conjunction: 'bg-[hsl(25_95%_55%/0.2)] text-[hsl(25,95%,35%)] border-[hsl(25,95%,55%)]',
};

const WORD_TYPE_LABELS: Record<string, string> = {
  noun: '📦 Noun — a person, place, or thing',
  verb: '🏃 Verb — an action word',
  adjective: '🎨 Adjective — describes a noun',
  conjunction: '🔗 Conjunction — connects ideas',
};

const SUCCESS_MESSAGES = [
  'Nice spotting! 🔍',
  'You found it! 🌟',
  'Great detective work! 🕵️',
  'Sharp eyes! 👀',
];

interface WordDetectiveProps {
  questions: WordDetectiveQuestion[];
  onComplete: () => void;
}

export function WordDetective({ questions, onComplete }: WordDetectiveProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (questions.length === 0) {
    onComplete();
    return null;
  }

  const question = questions[currentIndex];
  const words = question.sentence.split(/(\s+)/);

  const handleWordClick = (word: string) => {
    if (revealed) return;
    const cleaned = word.replace(/[.,!?;:"']/g, '').toLowerCase();
    const target = question.target_word.toLowerCase();
    setSelectedWord(word);
    setIsCorrect(cleaned === target);
    setRevealed(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedWord(null);
      setRevealed(false);
      setIsCorrect(false);
    } else {
      onComplete();
    }
  };

  const successMsg = SUCCESS_MESSAGES[currentIndex % SUCCESS_MESSAGES.length];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <Search className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Word Detective</h3>
          <p className="text-xs text-muted-foreground">
            {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Prompt */}
      <p className="text-base font-semibold text-foreground mb-4 mt-4">
        {question.prompt}
      </p>

      {/* Sentence with clickable words */}
      <div className="bg-muted/50 rounded-xl p-5 mb-5 leading-loose text-lg flex flex-wrap gap-y-1">
        {words.map((word, i) => {
          if (word.trim() === '') return <span key={i}>&nbsp;</span>;
          const cleaned = word.replace(/[.,!?;:"']/g, '').toLowerCase();
          const isTarget = cleaned === question.target_word.toLowerCase();
          const isSelected = selectedWord === word;
          const showHighlight = revealed && isTarget;

          return (
            <button
              key={i}
              onClick={() => handleWordClick(word)}
              disabled={revealed}
              className={cn(
                'px-1.5 py-0.5 rounded-lg transition-all duration-200 font-medium cursor-pointer border-2 border-transparent',
                !revealed && 'hover:bg-primary/10 hover:border-primary/30',
                isSelected && !isCorrect && revealed && 'bg-muted border-muted-foreground/30',
                showHighlight && WORD_TYPE_COLORS[question.word_type],
                revealed && !isTarget && 'cursor-default opacity-70'
              )}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className="animate-slide-up mb-5">
          {isCorrect ? (
            <div className="bg-success/10 border-2 border-success/30 rounded-xl p-4">
              <p className="font-bold text-success text-lg mb-1">{successMsg}</p>
              <p className="text-sm text-muted-foreground">
                <span className={cn(
                  'inline-block px-2 py-0.5 rounded-md text-xs font-bold mr-2 border',
                  WORD_TYPE_COLORS[question.word_type]
                )}>
                  {question.word_type}
                </span>
                {question.feedback}
              </p>
            </div>
          ) : (
            <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-4">
              <p className="font-bold text-foreground text-lg mb-1">Almost! Try looking again 👀</p>
              <p className="text-sm text-muted-foreground">
                The word <span className={cn(
                  'inline-block px-2 py-0.5 rounded-md font-bold mx-1 border',
                  WORD_TYPE_COLORS[question.word_type]
                )}>"{question.target_word}"</span> is the answer.
                {' '}{question.feedback}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {WORD_TYPE_LABELS[question.word_type]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next / Done */}
      {revealed && (
        <Button onClick={handleNext} className="w-full py-5 text-lg font-bold" size="lg">
          {currentIndex < questions.length - 1 ? 'Next Word 🔎' : 'All Done! 🎉'}
        </Button>
      )}
    </div>
  );
}
