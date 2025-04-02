
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarNavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  collapsed: boolean;
  isPremiumFeature?: boolean;
  userHasPremium?: boolean;
  onItemClick?: () => void;
}

export function SidebarNavItem({ 
  name, 
  path, 
  icon, 
  collapsed,
  isPremiumFeature = false,
  userHasPremium = false,
  onItemClick
}: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === path;
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };
  
  // Item content with appropriate ARIA attributes
  const itemContent = (
    <div className={cn(
      'flex items-center gap-2 rounded-md px-3 py-2.5', 
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      isMobile && !collapsed && 'py-3 text-base',
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
    )}>
      <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
      {!collapsed && (
        <div className="flex items-center justify-between w-full">
          <span className={cn("text-sm font-medium", isMobile && "text-base")}>
            {name}
          </span>
          {isPremiumFeature && !userHasPremium && (
            <Lock className="h-3.5 w-3.5 text-yellow-500" aria-label="Fonction premium" />
          )}
        </div>
      )}
    </div>
  );

  const tooltipContent = isPremiumFeature && !userHasPremium 
    ? "Fonctionnalité premium"
    : name;
    
  // Pour mobile, pas de tooltips et ajout du gestionnaire de clic
  if (isMobile || !collapsed) {
    return (
      <li>
        <Link 
          to={path} 
          aria-label={name} 
          aria-current={isActive ? 'page' : undefined}
          onClick={handleClick}
        >
          {itemContent}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Link 
              to={path}
              aria-label={name}
              aria-current={isActive ? 'page' : undefined}
            >
              {itemContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
