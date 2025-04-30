
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
    if (onItemClick) {
      onItemClick();
    }
  };
  
  // Contenu de l'élément avec attributs ARIA appropriés
  const itemContent = (
    <div className={cn(
      'flex items-center gap-2 rounded-md px-3 py-2.5', // Slightly increased vertical padding
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      isMobile && !collapsed && 'py-3 text-base', // Increased padding for mobile
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
    )}>
      <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">{icon}</span>
      {!collapsed && (
        <div className="flex items-center justify-between w-full">
          <span className={cn(
            "text-sm font-medium truncate", 
            isMobile && "text-base",
            "ml-2" // Added left margin for better spacing
          )}>
            {name}
          </span>
          {isPremiumFeature && !userHasPremium && (
            <Lock className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" aria-label="Fonction premium" />
          )}
        </div>
      )}
    </div>
  );

  const tooltipContent = isPremiumFeature && !userHasPremium 
    ? "Fonctionnalité premium"
    : name;
    
  // Pour mobile ou quand la sidebar n'est pas repliée, pas besoin de tooltips
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

  // Version desktop avec tooltip quand la sidebar est repliée
  return (
    <li>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Link 
              to={path}
              aria-label={name}
              aria-current={isActive ? 'page' : undefined}
              onClick={handleClick}
            >
              {itemContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-popover text-popover-foreground border border-border">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
