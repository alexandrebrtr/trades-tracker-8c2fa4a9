
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
  const isMobile = useIsMobile();
  
  // Simplify item content for mobile
  const itemContent = (
    <div className={cn(
      'flex items-center gap-2 rounded-md px-3 py-2.5', 
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      isMobile && !collapsed && 'py-3',
    )}>
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <div className="flex items-center justify-between w-full">
          <span className={cn("text-sm font-medium", isMobile && "text-base")}>
            {name}
          </span>
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
    
  // For mobile, we don't need tooltips as they can cause UX issues
  if (isMobile) {
    return (
      <li>
        <Link to={path} aria-label={name}>
          {itemContent}
        </Link>
      </li>
    );
  }

  return (
    <li>
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
