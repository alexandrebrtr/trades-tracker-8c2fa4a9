
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxis } from '@/utils/chartUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceAreaChartProps {
  data: any[];
  isPositive: boolean;
}

export const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({ data = [], isPositive = true }) => {
  const isMobile = useIsMobile();
  
  // Make sure we have data to display
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">Aucune donnée disponible</div>;
  }
  
  // Find min and max values to ensure proper y-axis domain
  const minValue = Math.min(...data.map(item => item?.value || 0));
  const maxValue = Math.max(...data.map(item => item?.value || 0));
  
  // Add padding to min/max for better visualization
  const yAxisMin = Math.floor(minValue * 0.9); // Increased space below to show negative values better
  const yAxisMax = Math.ceil(maxValue * 1.1);
  
  // For flat lines (only one value or all same values), add some padding
  const adjustedYAxisMin = minValue === maxValue ? minValue * 0.9 : yAxisMin;
  const adjustedYAxisMax = minValue === maxValue ? maxValue * 1.1 : yAxisMax;
  
  // Adapter la largeur du graphique si mobile
  const chartWidth = isMobile ? Math.max(data.length * 50, 350) : '100%';
  
  const chart = (
    <AreaChart
      data={data}
      width={isMobile ? chartWidth as number : undefined}
      height={isMobile ? 220 : undefined}
      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
    >
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop 
            offset="5%" 
            stopColor={isPositive ? '#34d399' : '#ef4444'} 
            stopOpacity={0.2} 
          />
          <stop 
            offset="95%" 
            stopColor={isPositive ? '#34d399' : '#ef4444'} 
            stopOpacity={0} 
          />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12 }} 
        tickLine={false}
        axisLine={{ stroke: '#f0f0f0' }}
        dy={10}
        // Incliner les étiquettes sur mobile pour mieux les afficher
        angle={isMobile ? -45 : 0}
        textAnchor={isMobile ? "end" : "middle"}
        height={isMobile ? 50 : 30}
      />
      <YAxis 
        tickFormatter={formatYAxis}
        tick={{ fontSize: 12 }} 
        tickLine={false}
        axisLine={false}
        dx={-10}
        domain={[adjustedYAxisMin, adjustedYAxisMax]} 
      />
      <Tooltip content={<CustomTooltip />} />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke={isPositive ? '#34d399' : '#ef4444'} 
        fillOpacity={1}
        fill="url(#colorValue)" 
        strokeWidth={2}
        activeDot={{ r: 6 }}
      />
    </AreaChart>
  );

  return isMobile ? (
    <ScrollArea className="h-full w-full">
      <div className="h-full min-w-full" style={{ width: typeof chartWidth === 'number' ? `${chartWidth}px` : '100%' }}>
        {chart}
      </div>
    </ScrollArea>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      {chart}
    </ResponsiveContainer>
  );
};
