import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, BarChart3, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { signOut } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="font-fredoka text-xl text-primary">Reading Coach</h1>
              <p className="text-sm text-muted-foreground">Grade 3</p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {settings?.child_name && (
              <span className="hidden sm:block text-sm font-medium text-muted-foreground mr-2">
                Hi, {settings.child_name}! 👋
              </span>
            )}
            
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate('/')}
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Button>
            
            <Button
              variant={location.pathname === '/progress' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate('/progress')}
              title="Progress"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
            
            <Button
              variant={location.pathname === '/settings' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate('/settings')}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
