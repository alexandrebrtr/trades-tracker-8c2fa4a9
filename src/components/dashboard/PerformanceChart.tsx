
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for initial render
const generateMockData = () => {
  const data = [];
  const baseValue = 10000;
  let currentValue = baseValue;
  
  for (let i = 0; i < 30; i++) {
    const change = Math.random() > 0.4 
      ? Math.random() * 500 
      : -Math.random() * 300;
    
    currentValue += change;
    if (currentValue < 0) currentValue = 100; // Prevent negative values
    
    data.push({
      date: new Date(2023, 0, i + 1).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      value: Math.round(currentValue),
    });
  }
  return data;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-xs text-muted-foreground/90 mb-1">{label}</p>
        <p className="text-sm font-semibold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

interface PerformanceChartProps {
  className?: string;
  timeframe?: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

export function PerformanceChart({ className, timeframe = '1M' }: PerformanceChartProps) {
  const [data, setData] = useState(generateMockData());
  const [isPositive, setIsPositive] = useState(true);

  // When timeframe changes, update data
  useEffect(() => {
    const newData = generateMockData();
    setData(newData);
    
    // Determine if trend is positive
    setIsPositive(newData[newData.length - 1].value >= newData[0].value);
  }, [timeframe]);

  // Format numbers as currency
  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  return (
    <div className={`glass-card ${className}`}>
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">Performance du compte</h3>
        <div className="flex space-x-2">
          {(['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
            <button
              key={period}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                timeframe === period 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64">
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
}
