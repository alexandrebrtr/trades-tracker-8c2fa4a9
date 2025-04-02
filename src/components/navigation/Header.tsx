
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeaderBalance } from "@/components/HeaderBalance";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Moon, Sun, LogIn } from "lucide-react";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Calculate display name - prioritize username from profile
  const displayName = profile?.username || (user?.email ? user.email.split('@')[0] : 'Utilisateur');

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex-shrink-0 mr-auto">
        <Link to="/" className="flex items-center gap-2" aria-label="Trades Tracker - Journal de Trading">
          <img 
            src="/lovable-uploads/0e632e9a-e44f-4b6e-aab1-8f8757c08470.png" 
            alt="Trades Tracker Logo" 
            className="h-8 w-auto" 
            width="32" 
            height="32" 
          />
          <span className="text-primary font-semibold text-lg sm:text-xl hidden sm:inline-block">
            Trades Tracker
          </span>
        </Link>
      </div>
      
      <div className="flex items-center justify-end gap-2 sm:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          aria-label={theme === 'dark' ? "Activer le mode clair" : "Activer le mode sombre"}
          className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <div className="hidden sm:block">
          <HeaderBalance />
        </div>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full" 
                aria-label="Menu utilisateur"
                aria-haspopup="true"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || ''} alt={`Avatar de ${displayName}`} />
                  <AvatarFallback>
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="sm:hidden p-2">
                <HeaderBalance />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline-block">Connexion</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
