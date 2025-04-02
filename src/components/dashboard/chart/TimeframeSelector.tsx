
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
  
  // Available periods
  const periods = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;
  
  const periodLabels = {
    '1W': '1 Semaine',
    '1M': '1 Mois',
    '3M': '3 Mois',
    '6M': '6 Mois',
    '1Y': '1 An',
    'ALL': 'Tout'
  };
  
  // If mobile, use ScrollArea for horizontal scrolling
  return isMobile ? (
    <div 
      className="w-full" 
      role="group" 
      aria-label="Sélection de période"
    >
      <ScrollArea className="w-full max-w-[calc(100vw-3rem)]">
        <div className="flex space-x-3 pr-4">
          {periods.map((period) => (
            <button
              key={period}
              className={`px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap min-w-[48px] min-h-[44px] ${
                selectedTimeframe === period 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'bg-secondary text-foreground hover:bg-secondary/70'
              }`}
              onClick={() => onTimeframeChange(period)}
              aria-label={`Période: ${periodLabels[period]}`}
              aria-pressed={selectedTimeframe === period}
            >
              {period}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  ) : (
    <div 
      className="flex space-x-2" 
      role="group" 
      aria-label="Sélection de période"
    >
      {periods.map((period) => (
        <button
          key={period}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            selectedTimeframe === period 
              ? 'bg-primary text-primary-foreground font-medium' 
              : 'bg-secondary text-foreground hover:bg-secondary/70'
          }`}
          onClick={() => onTimeframeChange(period)}
          aria-label={`Période: ${periodLabels[period]}`}
          aria-pressed={selectedTimeframe === period}
        >
          {period}
        </button>
      ))}
    </div>
  );
};
