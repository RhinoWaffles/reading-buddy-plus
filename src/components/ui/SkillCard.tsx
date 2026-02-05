import { cn } from '@/lib/utils';
import type { SkillCategory } from '@/types/reading';
import { SKILL_CATEGORIES } from '@/types/reading';

interface SkillCardProps {
  category: SkillCategory;
  accuracy?: number;
  sessionsCount?: number;
  onClick?: () => void;
  selected?: boolean;
}

const categoryColors: Record<SkillCategory, string> = {
  A: 'bg-skill-a/10 border-skill-a/30 hover:border-skill-a',
  B: 'bg-skill-b/10 border-skill-b/30 hover:border-skill-b',
  C: 'bg-skill-c/10 border-skill-c/30 hover:border-skill-c',
  D: 'bg-skill-d/10 border-skill-d/30 hover:border-skill-d',
};

const categoryTextColors: Record<SkillCategory, string> = {
  A: 'text-skill-a',
  B: 'text-skill-b',
  C: 'text-skill-c',
  D: 'text-skill-d',
};

export function SkillCard({ 
  category, 
  accuracy, 
  sessionsCount = 0,
  onClick, 
  selected 
}: SkillCardProps) {
  const skill = SKILL_CATEGORIES[category];

  return (
    <button
      onClick={onClick}
      className={cn(
        'card-skill text-left border-2 w-full',
        categoryColors[category],
        selected && 'ring-2 ring-offset-2',
        selected && categoryTextColors[category].replace('text-', 'ring-')
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{skill.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-bold text-lg', categoryTextColors[category])}>
            {skill.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {skill.description}
          </p>
          {accuracy !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn('h-full rounded-full transition-all', categoryTextColors[category].replace('text-', 'bg-'))}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{accuracy}%</span>
            </div>
          )}
          {sessionsCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {sessionsCount} session{sessionsCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
