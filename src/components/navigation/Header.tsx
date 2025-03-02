
import { Link } from 'react-router-dom';
import { Sun, Moon, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm transition-all">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Left side is now empty */}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            asChild
          >
            <Link to="/login" aria-label="Se connecter">
              <LogIn className="h-4 w-4 mr-1" />
              <span>Se connecter</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
            aria-label="Changer de thème"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link to="/settings" aria-label="Paramètres du profil">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                T
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
