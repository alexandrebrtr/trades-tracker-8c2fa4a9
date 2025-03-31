
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimeframeSelectorProps {
  selectedTimeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  onTimeframeChange: (timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => void;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ 
  selectedTimeframe, 
  onTimeframeChange 
}) => {
  const isMobile = useIsMobile();
  
  // Périodes disponibles
  const periods = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;
  
  // Si mobile, utiliser ScrollArea pour permettre de faire défiler horizontalement
  return isMobile ? (
    <ScrollArea className="w-full max-w-[calc(100vw-3rem)]">
      <div className="flex space-x-2 pr-4">
        {periods.map((period) => (
          <button
            key={period}
            className={`px-2 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
              selectedTimeframe === period 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
            }`}
            onClick={() => onTimeframeChange(period)}
          >
            {period}
          </button>
        ))}
      </div>
    </ScrollArea>
  ) : (
    <div className="flex space-x-2">
      {periods.map((period) => (
        <button
          key={period}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            selectedTimeframe === period 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
          }`}
          onClick={() => onTimeframeChange(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};
