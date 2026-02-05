import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EvidenceSpan } from '@/types/reading';

interface PassageDisplayProps {
  title: string;
  text: string;
  passageType: 'fiction' | 'nonfiction';
  evidenceSpans?: EvidenceSpan[];
  showEvidence?: boolean;
}

export function PassageDisplay({ 
  title, 
  text, 
  passageType,
  evidenceSpans = [],
  showEvidence = false
}: PassageDisplayProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Render text with evidence highlighting
  const renderTextWithEvidence = () => {
    if (!showEvidence || evidenceSpans.length === 0) {
      return <p className="passage-text">{text}</p>;
    }

    // Sort spans by start position
    const sortedSpans = [...evidenceSpans].sort((a, b) => a.start - b.start);
    
    const elements: React.ReactNode[] = [];
    let lastEnd = 0;

    sortedSpans.forEach((span, index) => {
      // Add text before this span
      if (span.start > lastEnd) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastEnd, span.start)}
          </span>
        );
      }
      
      // Add highlighted span
      elements.push(
        <span key={`evidence-${index}`} className="evidence-highlight">
          {text.slice(span.start, span.end)}
        </span>
      );
      
      lastEnd = span.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      elements.push(
        <span key="text-end">{text.slice(lastEnd)}</span>
      );
    }

    return <p className="passage-text">{elements}</p>;
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
            passageType === 'fiction' 
              ? 'bg-skill-a/20 text-skill-a' 
              : 'bg-skill-b/20 text-skill-b'
          }`}>
            {passageType === 'fiction' ? '📖 Fiction' : '📚 Nonfiction'}
          </span>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleReadAloud}
          className="flex-shrink-0 gap-2"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              Read Aloud
            </>
          )}
        </Button>
      </div>
      
      <div className="prose prose-lg max-w-none">
        {renderTextWithEvidence()}
      </div>
    </div>
  );
}
