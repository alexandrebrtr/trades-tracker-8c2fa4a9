
import React from 'react';

interface TimeframeSelectorProps {
  selectedTimeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  onTimeframeChange: (timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => void;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ 
  selectedTimeframe, 
  onTimeframeChange 
}) => {
  return (
    <div className="flex space-x-2">
      {(['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
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
