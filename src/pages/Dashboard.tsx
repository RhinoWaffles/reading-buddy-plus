import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SkillCard } from '@/components/ui/SkillCard';
import { Button } from '@/components/ui/button';
import { useDailyStats } from '@/hooks/useDailyStats';
import { useSessions } from '@/hooks/useSessions';
import { useSettings } from '@/hooks/useSettings';
import { Play, Flame, BookOpen } from 'lucide-react';
import type { SkillCategory } from '@/types/reading';

export default function Dashboard() {
  const navigate = useNavigate();
  const { todayStats, isLoading: statsLoading } = useDailyStats();
  const { sessions } = useSessions();
  const { settings } = useSettings();

  // Calculate progress for today (goal: 3 sessions = 100%)
  const dailyGoal = 3;
  const sessionsToday = todayStats?.sessions_completed || 0;
  const progressPercent = Math.min((sessionsToday / dailyGoal) * 100, 100);

  // Calculate skill accuracies
  const getSkillAccuracy = (category: SkillCategory) => {
    const categorySessions = sessions?.filter(s => s.primary_skill_category === category && s.completed_at) || [];
    if (categorySessions.length === 0) return undefined;
    
    const totalCorrect = categorySessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
    const totalQuestions = categorySessions.reduce((sum, s) => sum + s.total_questions, 0);
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  };

  const getSkillSessionCount = (category: SkillCategory) => {
    return sessions?.filter(s => s.primary_skill_category === category && s.completed_at).length || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Ready to Read, {settings?.child_name || 'Reader'}? 🌟
          </h2>
          <p className="text-muted-foreground">
            Let's practice reading together!
          </p>
        </div>

        {/* Stats and Start Button */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily Progress Card */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Today's Progress</h3>
              <div className="flex items-center gap-1 text-secondary">
                <Flame className="w-5 h-5" />
                <span className="font-bold">{todayStats?.streak || 0} day streak</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-8">
              <ProgressRing progress={progressPercent} size={140} strokeWidth={10}>
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">{sessionsToday}</span>
                  <span className="text-lg text-muted-foreground">/{dailyGoal}</span>
                  <p className="text-xs text-muted-foreground">sessions</p>
                </div>
              </ProgressRing>
              
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {todayStats?.minutes_spent || 0} minutes today
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span className="text-sm text-muted-foreground">
                    {todayStats?.correct_count || 0}/{todayStats?.total_count || 0} correct
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Session Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-card text-primary-foreground flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">5 Minute Reading Session</h3>
            <p className="text-primary-foreground/80 mb-6">
              Read a passage and answer 4 questions to practice your skills!
            </p>
            <Button
              onClick={() => navigate('/session')}
              size="lg"
              className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg py-6 gap-3"
            >
              <Play className="w-6 h-6" />
              Start Session
            </Button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Your Skills</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['A', 'B', 'C', 'D'] as SkillCategory[]).map((category) => (
              <SkillCard
                key={category}
                category={category}
                accuracy={getSkillAccuracy(category)}
                sessionsCount={getSkillSessionCount(category)}
              />
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions && sessions.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <button
                  key={session.id}
                  onClick={() => session.completed_at && navigate(`/results/${session.id}`)}
                  className="w-full bg-card rounded-xl p-4 shadow-soft text-left hover:shadow-card transition-shadow"
                  disabled={!session.completed_at}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{session.passage_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.passage_type === 'fiction' ? '📖' : '📚'} {session.passage_type} • 
                        {session.completed_at ? ` ${session.correct_count}/${session.total_questions} correct` : ' In progress...'}
                      </p>
                    </div>
                    {session.completed_at && (
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${
                          (session.correct_count || 0) >= 3 ? 'text-success' : 
                          (session.correct_count || 0) >= 2 ? 'text-accent' : 'text-secondary'
                        }`}>
                          {Math.round(((session.correct_count || 0) / session.total_questions) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
