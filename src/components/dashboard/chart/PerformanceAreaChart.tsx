
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxis } from '@/utils/chartUtils';

interface PerformanceAreaChartProps {
  data: any[];
  isPositive: boolean;
}

export const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({ data, isPositive }) => {
  // Find min and max values to ensure proper y-axis domain
  const minValue = Math.min(...data.map(item => item.value));
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Add padding to min/max for better visualization
  const yAxisMin = Math.floor(minValue * 1.1);
  const yAxisMax = Math.ceil(maxValue * 1.1);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
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
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#f0f0f0' }}
          dy={10}
        />
        <YAxis 
          tickFormatter={formatYAxis}
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          dx={-10}
          domain={[yAxisMin < 0 ? yAxisMin : 0, yAxisMax]}
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
  );
};
