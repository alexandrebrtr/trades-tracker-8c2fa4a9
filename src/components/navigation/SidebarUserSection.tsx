
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LogOut, 
  Settings, 
  User, 
  ChevronDown, 
  CreditCard,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarUserSectionProps {
  collapsed: boolean;
  onUserAction?: () => void;
}

export function SidebarUserSection({ collapsed, onUserAction }: SidebarUserSectionProps) {
  const { user, profile, signOut } = useAuth();
  const { isPremium } = usePremium();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    if (isMobile && onUserAction) {
      onUserAction();
    }
  };

  const handleLinkClick = () => {
    if (isMobile && onUserAction) {
      onUserAction();
    }
    setIsOpen(false);
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'GU';

  if (collapsed) {
    return (
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || ''} alt={user?.email || 'Guest User'} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex w-full cursor-default" onClick={handleLinkClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex w-full cursor-default" onClick={handleLinkClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/premium" className="flex w-full cursor-default" onClick={handleLinkClick}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>{isPremium ? "Gérer l'abonnement" : "Passer au Premium"}</span>
                {isPremium && <Shield className="ml-2 h-3 w-3 text-yellow-500" />}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="mt-auto p-4 border-t border-sidebar-border">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={profile?.avatar_url || ''} alt={user?.email || 'Guest User'} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <span className="truncate">{user?.email || 'Guest User'}</span>
            <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex w-full cursor-default" onClick={handleLinkClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex w-full cursor-default" onClick={handleLinkClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/premium" className="flex w-full cursor-default" onClick={handleLinkClick}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>{isPremium ? "Gérer l'abonnement" : "Passer au Premium"}</span>
              {isPremium && <Shield className="ml-2 h-3 w-3 text-yellow-500" />}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
