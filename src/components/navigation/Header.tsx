import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeaderBalance } from "@/components/HeaderBalance";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Moon, Sun, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  mobileMode?: boolean;
}

export function Header({ mobileMode = false }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Calculer le nom à afficher - priorité au nom d'utilisateur du profil
  const displayName = profile?.username || (user?.email ? user.email.split('@')[0] : t('common.user'));

  if (mobileMode) {
    return (
      <div className="flex items-center gap-1">
        <LanguageSwitcher size="icon" variant="ghost" />

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
          className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-primary" 
                aria-label={t('header.userMenu')}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} alt={`${t('header.avatarAlt')} ${displayName}`} />
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
                  {t('user.profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t('user.settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('auth.logout')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2">
                <HeaderBalance />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="focus-visible:ring-2 focus-visible:ring-primary h-8">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              <span className="sr-only md:not-sr-only">{t('auth.login')}</span>
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <header 
      className="sticky top-0 z-30 w-full flex h-12 items-center gap-2 border-b bg-background px-2 sm:px-4" 
      role="banner"
      aria-label={t('header.siteHeader')}
    >
      <div className="flex flex-1 items-center justify-end gap-2">
        <LanguageSwitcher />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
          className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
        
        {!isMobile && <HeaderBalance />}
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-7 w-7 rounded-full focus-visible:ring-2 focus-visible:ring-primary" 
                aria-label={t('header.userMenu')}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile?.avatar_url || ''} alt={`${t('header.avatarAlt')} ${displayName}`} />
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
                  {t('user.profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t('user.settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('auth.logout')}
              </DropdownMenuItem>
              {isMobile && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <HeaderBalance />
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="focus-visible:ring-2 focus-visible:ring-primary h-7">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              {t('auth.login')}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
