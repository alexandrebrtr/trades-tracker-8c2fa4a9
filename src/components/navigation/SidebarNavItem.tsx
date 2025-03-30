
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  collapsed: boolean;
  isPremiumFeature?: boolean;
  userHasPremium?: boolean;
}

export function SidebarNavItem({ 
  name, 
  path, 
  icon, 
  collapsed,
  isPremiumFeature = false,
  userHasPremium = false
}: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  const itemContent = (
    <div className={cn(
      'flex items-center gap-3 rounded-md px-3 py-3', // Augmenté py-2 à py-3 pour plus de hauteur
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    )}>
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium">{name}</span>
          {isPremiumFeature && !userHasPremium && (
            <Lock className="h-3.5 w-3.5 text-yellow-500" />
          )}
        </div>
      )}
    </div>
  );

  const tooltipContent = isPremiumFeature && !userHasPremium 
    ? "Fonctionnalité premium"
    : name;

  return (
    <li className="mb-2"> {/* Ajout de mb-2 pour augmenter la marge en bas de chaque élément */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={path} aria-label={name}>
              {itemContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
