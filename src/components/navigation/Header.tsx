
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogIn, User, LogOut, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePremium } from '@/context/PremiumContext';
import { Star } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm transition-all">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo or brand could go here */}
        </div>

        <div className="flex items-center gap-2">
          {!user ? (
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
          ) : null}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
            aria-label="Changer de thème"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || user.email || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span className="flex-1">Solde</span>
                  <span className="font-medium">{formatCurrency(profile?.balance || 0)}</span>
                </DropdownMenuItem>
                
                {!isPremium && (
                  <DropdownMenuItem asChild>
                    <Link to="/premium" className="flex items-center text-primary">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Obtenir Premium</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
