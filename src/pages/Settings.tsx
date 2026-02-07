import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, User, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { settings, isLoading, updateSettings } = useSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [childName, setChildName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Initialize form with settings
  useState(() => {
    if (settings) {
      setChildName(settings.child_name);
    }
  });

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({ child_name: childName });
      toast({
        title: "Settings saved!",
        description: "Your changes have been saved.",
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartOver = async () => {
    if (!user) return;
    
    setIsResetting(true);
    try {
      // Delete all attempts for user's sessions first (due to foreign key)
      const { data: userSessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', user.id);
      
      if (userSessions && userSessions.length > 0) {
        const sessionIds = userSessions.map(s => s.id);
        await supabase
          .from('attempts')
          .delete()
          .in('session_id', sessionIds);
        
        // Delete questions for user's sessions
        await supabase
          .from('questions')
          .delete()
          .in('session_id', sessionIds);
      }
      
      // Delete all sessions
      await supabase
        .from('sessions')
        .delete()
        .eq('user_id', user.id);
      
      // Delete all daily stats
      await supabase
        .from('daily_stats')
        .delete()
        .eq('user_id', user.id);
      
      // Invalidate all queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['daily-stats'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-stats'] });
      
      toast({
        title: "Fresh start! 🌟",
        description: "All progress has been reset. Ready for a new reader!",
      });
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Error",
        description: "Failed to reset progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>

        <div className="bg-card rounded-2xl p-6 shadow-soft space-y-6">
          {/* Child Name */}
          <div className="space-y-2">
            <Label htmlFor="childName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Child's Name
            </Label>
            <Input
              id="childName"
              value={childName || settings?.child_name || ''}
              onChange={(e) => {
                setChildName(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Enter child's name"
              className="h-12 text-lg"
            />
            <p className="text-sm text-muted-foreground">
              This name will be displayed throughout the app.
            </p>
          </div>

          {/* Grade Level (read-only for now) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              📚 Grade Level
            </Label>
            <div className="h-12 px-4 flex items-center bg-muted rounded-lg text-lg font-medium">
              Grade {settings?.grade_level || 3}
            </div>
            <p className="text-sm text-muted-foreground">
              Reading content is optimized for Grade 3 level.
            </p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateSettings.isPending}
            className="w-full py-6 text-lg font-bold"
          >
            {updateSettings.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Settings
          </Button>
        </div>

        {/* Start Over Section */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Start Over
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reset all progress and start fresh. Perfect for when a new reader takes over!
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full py-6 text-lg font-bold border-destructive text-destructive hover:bg-destructive/10"
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <RotateCcw className="w-5 h-5 mr-2" />
                  )}
                  Start Over
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start fresh?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all reading sessions, answers, and progress. 
                    Your child's name and settings will be kept.
                    <br /><br />
                    <strong>This cannot be undone!</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleStartOver}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, start over
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="font-fredoka text-primary text-lg mb-1">Reading Coach Grade 3</p>
          <p>Daily 5-minute reading comprehension practice</p>
          <p className="mt-2">A private family app for focused learning 📚</p>
        </div>
      </main>
    </div>
  );
}
