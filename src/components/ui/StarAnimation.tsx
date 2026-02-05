import { Star } from 'lucide-react';

interface StarAnimationProps {
  count?: number;
  show: boolean;
}

export function StarAnimation({ count = 3, show }: StarAnimationProps) {
  if (!show) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="animate-star text-accent fill-accent"
          style={{ 
            animationDelay: `${i * 0.15}s`,
            width: 32 + (i === 1 ? 8 : 0),
            height: 32 + (i === 1 ? 8 : 0),
          }}
        />
      ))}
    </div>
  );
}
