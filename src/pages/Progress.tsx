import { Header } from '@/components/layout/Header';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SkillCard } from '@/components/ui/SkillCard';
import { useDailyStats } from '@/hooks/useDailyStats';
import { useSessions } from '@/hooks/useSessions';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { Flame, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import type { SkillCategory } from '@/types/reading';

export default function Progress() {
  const { todayStats, weekStats } = useDailyStats();
  const { sessions } = useSessions();

  // Calculate overall stats
  const completedSessions = sessions?.filter(s => s.completed_at) || [];
  const totalSessions = completedSessions.length;
  const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
  const totalQuestions = completedSessions.reduce((sum, s) => sum + s.total_questions, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Weekly chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStats = weekStats?.find(s => isSameDay(parseISO(s.date), date));
    return {
      day: format(date, 'EEE'),
      sessions: dayStats?.sessions_completed || 0,
      accuracy: dayStats && dayStats.total_count > 0 
        ? Math.round((dayStats.correct_count / dayStats.total_count) * 100) 
        : 0,
    };
  });

  // Skill breakdown
  const getSkillStats = (category: SkillCategory) => {
    const categorySessions = completedSessions.filter(s => s.primary_skill_category === category);
    const correct = categorySessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
    const total = categorySessions.reduce((sum, s) => sum + s.total_questions, 0);
    return {
      accuracy: total > 0 ? Math.round((correct / total) * 100) : undefined,
      sessionsCount: categorySessions.length,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Progress</h2>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 shadow-soft text-center">
            <Flame className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{todayStats?.streak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{totalSessions}</p>
            <p className="text-sm text-muted-foreground">Sessions Done</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{totalCorrect}</p>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{overallAccuracy}%</p>
            <p className="text-sm text-muted-foreground">Overall Accuracy</p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">This Week</h3>
          
          <div className="flex items-end justify-between gap-2 h-40">
            {last7Days.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary/20 rounded-t-lg transition-all duration-300 flex items-end justify-center"
                  style={{ height: `${Math.max(day.sessions * 25, 10)}%` }}
                >
                  {day.sessions > 0 && (
                    <span className="text-xs font-bold text-primary mb-1">{day.sessions}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Sessions completed each day
          </p>
        </div>

        {/* Skill Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Skills Breakdown</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['A', 'B', 'C', 'D'] as SkillCategory[]).map((category) => {
              const stats = getSkillStats(category);
              return (
                <SkillCard
                  key={category}
                  category={category}
                  accuracy={stats.accuracy}
                  sessionsCount={stats.sessionsCount}
                />
              );
            })}
          </div>
        </div>

        {/* Recent Sessions */}
        {completedSessions.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {completedSessions.slice(0, 10).map((session) => (
                <div 
                  key={session.id}
                  className="bg-card rounded-xl p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{session.passage_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.passage_type === 'fiction' ? '📖 Fiction' : '📚 Nonfiction'} • 
                        {session.created_at && format(parseISO(session.created_at), ' MMM d, h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${
                        (session.correct_count || 0) >= 3 ? 'text-success' : 
                        (session.correct_count || 0) >= 2 ? 'text-accent' : 'text-secondary'
                      }`}>
                        {session.correct_count}/{session.total_questions}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedSessions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No sessions completed yet!</p>
            <p className="text-sm">Start your first 5-minute reading session.</p>
          </div>
        )}
      </main>
    </div>
  );
}
