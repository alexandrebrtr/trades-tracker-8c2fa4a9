
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarUserSectionProps {
  collapsed: boolean;
}

export function SidebarUserSection({ collapsed }: SidebarUserSectionProps) {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // Si l'utilisateur n'est pas connecté, afficher un bouton de connexion
  if (!user) {
    return (
      <div className="border-t border-sidebar-border p-4">
        <Button 
          variant="outline" 
          className={cn(
            "w-full flex items-center justify-center",
            collapsed ? "p-2" : "px-4 py-2"
          )}
          asChild
        >
          <Link to="/login">
            {collapsed ? (
              <LogIn className="h-5 w-5" />
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                <span>Connexion</span>
              </>
            )}
          </Link>
        </Button>
      </div>
    );
  }

  // Prioritize username from profile, fallback to email username part
  const displayName = profile?.username || (user.email ? user.email.split('@')[0] : 'Utilisateur');
  const avatarText = displayName.charAt(0).toUpperCase();

  return (
    <div className="border-t border-sidebar-border p-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              'relative w-full flex items-center p-2 rounded-md cursor-pointer',
              collapsed ? 'justify-center' : 'justify-start gap-2'
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {avatarText}
              </AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex flex-col text-left ml-2 overflow-hidden">
                <span className="text-sm font-medium truncate">{displayName}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{user.email}</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-56" 
          align={collapsed ? "center" : "end"}
          side="top"
        >
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
