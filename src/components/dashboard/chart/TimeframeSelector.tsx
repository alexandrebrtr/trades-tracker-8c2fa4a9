
import React from 'react';
import { Button } from "@/components/ui/button";

type TimeFrame = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
  isMobile?: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  isMobile = false
}) => {
  const timeframes: { value: TimeFrame; label: string }[] = [
    { value: '1W', label: '1S' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1A' },
    { value: 'ALL', label: 'Tout' }
  ];

  return (
    <div className={`flex ${isMobile ? 'flex-wrap gap-2 justify-center' : 'space-x-1'}`}>
      {timeframes.map((tf) => (
        <Button
          key={tf.value}
          variant={selectedTimeframe === tf.value ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeframeChange(tf.value)}
          className={`px-2 py-1 ${isMobile ? 'text-xs min-w-[40px]' : ''}`}
        >
          {tf.label}
        </Button>
      ))}
    </div>
  );
};
