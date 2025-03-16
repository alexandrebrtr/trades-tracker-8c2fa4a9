
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  collapsed: boolean;
}

export function SidebarNavItem({ name, path, icon, collapsed }: NavItemProps) {
  const location = useLocation();
  
  return (
    <li>
      <Link
        to={path}
        className={cn(
          'flex items-center p-3 rounded-md transition-colors',
          collapsed ? 'justify-center' : 'justify-start',
          location.pathname === path 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        )}
      >
        <div className="flex items-center">
          {icon}
          {!collapsed && <span className="ml-3 font-medium">{name}</span>}
        </div>
      </Link>
    </li>
  );
}
