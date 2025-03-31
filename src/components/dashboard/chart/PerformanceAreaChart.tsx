
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxis } from '@/utils/chartUtils';
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

  // Calculate aspect ratio - for mobile, make it flexible to allow scrolling
  const aspectRatio = isMobile ? 1.5 : 2;
  
  return (
    <div className={`w-full ${isMobile ? 'overflow-x-auto' : ''}`}>
      <div style={{ 
        width: isMobile && data.length > 10 ? `${data.length * 50}px` : '100%', 
        minWidth: '100%',
        height: '100%' 
      }}>
        <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
          <AreaChart
            data={data}
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
              tick={{ fontSize: isMobile ? 10 : 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#f0f0f0' }}
              dy={10}
              height={isMobile ? 40 : 30}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: isMobile ? 10 : 12 }} 
              tickLine={false}
              axisLine={false}
              dx={isMobile ? -5 : -10}
              width={isMobile ? 40 : 60}
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
        </ResponsiveContainer>
      </div>
    </div>
  );
};
