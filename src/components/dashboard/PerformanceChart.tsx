
import { useState } from 'react';
import { useChartData } from '@/hooks/useChartData';
import { TimeframeSelector } from './chart/TimeframeSelector';
import { PerformanceAreaChart } from './chart/PerformanceAreaChart';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';

interface PerformanceChartProps {
  className?: string;
  timeframe?: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  userId?: string;
}

export function PerformanceChart({ className, timeframe = '1M', userId }: PerformanceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>(timeframe);
  const { data, isPositive, isLoading } = useChartData(userId, selectedTimeframe);
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  return (
    <div className={`glass-card ${className}`}>
      <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex justify-between items-center'} mb-6`}>
        <h2 className="text-lg font-semibold">{t('dashboard.performance')}</h2>
        <TimeframeSelector 
          selectedTimeframe={selectedTimeframe} 
          onTimeframeChange={setSelectedTimeframe} 
        />
      </div>
      
      <div className={`${isMobile ? 'h-52' : 'h-64'} overflow-hidden`}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">{t('dashboard.loading')}</span>
          </div>
        ) : (
          <PerformanceAreaChart data={data} isPositive={isPositive} />
        )}
      </div>
    </div>
  );
}
