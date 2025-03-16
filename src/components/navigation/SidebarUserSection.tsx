
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, CreditCard, LogOut, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function SidebarUserSection({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
  // Admin IDs - hardcoded for simplicity
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  const isAdmin = user && adminIds.includes(user.id);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <div className="border-t border-sidebar-border p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={cn(
            "flex items-center cursor-pointer rounded-md p-2 hover:bg-sidebar-accent/50",
            collapsed ? "justify-center" : "space-x-3"
          )}>
            <Avatar className="w-9 h-9">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || (user?.email || "Trader")} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {profile?.username?.charAt(0).toUpperCase() || (user?.email?.charAt(0).toUpperCase() || "T")}
              </AvatarFallback>
            </Avatar>
            {!collapsed && user && (
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {profile?.username || user.email?.split('@')[0] || 'Trader'}
                </p>
                <p className="text-xs text-sidebar-foreground/70">
                  {profile ? 'Solde: ' + (profile.balance || '0') + ' €' : 'Compte'}
                </p>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/premium" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Abonnement Premium</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
