import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { DailyStats } from '@/types/reading';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

export function useDailyStats() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: todayStats, isLoading } = useQuery({
    queryKey: ['daily-stats', user?.id, today],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      // Create today's stats if they don't exist
      if (!data) {
        // Get yesterday's stats to check streak
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const { data: yesterdayStats } = await supabase
          .from('daily_stats')
          .select('streak')
          .eq('user_id', user.id)
          .eq('date', yesterday)
          .maybeSingle();
        
        const newStreak = yesterdayStats?.streak || 0;
        
        const { data: newStats, error: insertError } = await supabase
          .from('daily_stats')
          .insert({ 
            user_id: user.id, 
            date: today,
            streak: newStreak,
            sessions_completed: 0,
            correct_count: 0,
            total_count: 0,
            minutes_spent: 0
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newStats as DailyStats;
      }
      
      return data as DailyStats;
    },
    enabled: !!user,
  });

  const { data: weekStats } = useQuery({
    queryKey: ['weekly-stats', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('date');
      
      if (error) throw error;
      return data as DailyStats[];
    },
    enabled: !!user,
  });

  const updateTodayStats = useMutation({
    mutationFn: async (updates: Partial<DailyStats>) => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('daily_stats')
        .update(updates)
        .eq('user_id', user.id)
        .eq('date', today)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-stats', user?.id, today] });
      queryClient.invalidateQueries({ queryKey: ['weekly-stats', user?.id] });
    },
  });

  const recordSessionComplete = useMutation({
    mutationFn: async ({ correctCount, totalCount, minutes }: { correctCount: number; totalCount: number; minutes: number }) => {
      if (!user || !todayStats) throw new Error('No user or stats');
      
      const newSessionsCompleted = todayStats.sessions_completed + 1;
      const newCorrect = todayStats.correct_count + correctCount;
      const newTotal = todayStats.total_count + totalCount;
      const newMinutes = todayStats.minutes_spent + minutes;
      const newStreak = newSessionsCompleted === 1 ? todayStats.streak + 1 : todayStats.streak;
      
      const { data, error } = await supabase
        .from('daily_stats')
        .update({
          sessions_completed: newSessionsCompleted,
          correct_count: newCorrect,
          total_count: newTotal,
          minutes_spent: newMinutes,
          streak: newStreak,
        })
        .eq('user_id', user.id)
        .eq('date', today)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-stats', user?.id, today] });
      queryClient.invalidateQueries({ queryKey: ['weekly-stats', user?.id] });
    },
  });

  return { todayStats, weekStats, isLoading, updateTodayStats, recordSessionComplete };
}
