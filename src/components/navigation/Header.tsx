
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeaderBalance } from "@/components/HeaderBalance";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Moon, Sun, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Calculate display name - prioritize username from profile
  const displayName = profile?.username || (user?.email ? user.email.split('@')[0] : 'Utilisateur');

  return (
    <header 
      className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6" 
      role="banner"
      aria-label="En-tête du site"
    >
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          aria-label={theme === 'dark' ? "Passer au mode clair" : "Passer au mode sombre"}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <div className={isMobile ? "hidden sm:block" : ""}>
          <HeaderBalance />
        </div>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full focus-visible:ring-2 focus-visible:ring-primary" 
                aria-label="Menu utilisateur"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || ''} alt={`Avatar de ${displayName}`} />
                  <AvatarFallback aria-hidden="true">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  {user.email && (
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" aria-hidden="true" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Déconnexion
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 sm:hidden">
                <HeaderBalance />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="focus-visible:ring-2 focus-visible:ring-primary">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Connexion
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
