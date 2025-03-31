
import { useState } from 'react';
import { useChartData } from '@/hooks/useChartData';
import { TimeframeSelector } from './chart/TimeframeSelector';
import { PerformanceAreaChart } from './chart/PerformanceAreaChart';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceChartProps {
  className?: string;
  timeframe?: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  userId?: string;
}

export function PerformanceChart({ className, timeframe = '1M', userId }: PerformanceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>(timeframe);
  const { data, isPositive, isLoading } = useChartData(userId, selectedTimeframe);
  const isMobile = useIsMobile();

  return (
    <div className={`glass-card ${className}`}>
      <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex justify-between'} mb-6`}>
        <h3 className="text-lg font-semibold">Performance du compte</h3>
        <TimeframeSelector 
          selectedTimeframe={selectedTimeframe} 
          onTimeframeChange={setSelectedTimeframe} 
          isMobile={isMobile}
        />
      </div>
      
      <div className="h-64">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Chargement des données...</span>
          </div>
        ) : (
          <PerformanceAreaChart data={data} isPositive={isPositive} />
        )}
      </div>
    </div>
  );
}
