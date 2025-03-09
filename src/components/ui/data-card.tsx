
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export interface DataCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  valueClassName?: string;
  isLoading?: boolean;
}

export function DataCard({ 
  title, 
  value, 
  trend, 
  className, 
  tooltip,
  icon,
  valueClassName,
  isLoading = false 
}: DataCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            {title}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-1 cursor-help inline-block text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
        </div>
        {trend && (
          <div className={`flex items-center text-xs ${trend.isPositive ? 'text-profit' : 'text-loss'}`}>
            {trend.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-xl font-bold", valueClassName)}>{isLoading ? "..." : value}</div>
      </CardContent>
    </Card>
  );
}
