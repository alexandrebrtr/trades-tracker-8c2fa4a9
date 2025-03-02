
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export function DataCard({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
  onClick,
  isLoading = false,
}: DataCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-xl border border-border/50 animate-scale-in',
        onClick && 'cursor-pointer hover:border-primary/20 animated-card',
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground/70">{icon}</div>}
      </div>
      
      {isLoading ? (
        <div className="h-8 bg-muted/50 animate-pulse rounded" />
      ) : (
        <div className="mt-2">
          <div className={cn('text-2xl font-semibold', valueClassName)}>
            {value}
          </div>
          
          {trend && (
            <div className="flex items-center mt-1 text-xs">
              <span
                className={cn(
                  'flex items-center',
                  trend.isPositive ? 'text-profit' : 'text-loss'
                )}
              >
                {trend.isPositive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.428-6.36L7 10.942 1.22 5.161a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground ml-1">vs. last period</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
