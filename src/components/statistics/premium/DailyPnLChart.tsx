
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';

interface DailyPnLData {
  date: string;
  pnl: number;
}

export function DailyPnLChart() {
  const [data, setData] = useState<DailyPnLData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const { trades } = useTradesFetcher(user?.id, 'all');
  
  useEffect(() => {
    if (trades.length > 0) {
      // Group trades by date
      const tradesByDate: Record<string, number> = {};
      
      trades.forEach(trade => {
        const date = new Date(trade.date).toISOString().split('T')[0];
        if (!tradesByDate[date]) {
          tradesByDate[date] = 0;
        }
        tradesByDate[date] += Number(trade.pnl) || 0;
      });
      
      // Convert to array format for chart
      const chartData = Object.entries(tradesByDate)
        .map(([date, pnl]) => ({
          date,
          pnl: Number(pnl.toFixed(2))
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Show last 30 days
      
      setData(chartData);
      setLoading(false);
    } else {
      // Sample data when no trades are available
      const sampleData = [
        { date: '2025-01-01', pnl: 145.20 },
        { date: '2025-01-02', pnl: -78.50 },
        { date: '2025-01-03', pnl: 210.75 },
        { date: '2025-01-04', pnl: 98.30 },
        { date: '2025-01-05', pnl: -120.45 },
        { date: '2025-01-06', pnl: 187.60 },
        { date: '2025-01-07', pnl: -45.80 },
      ];
      setData(sampleData);
      setLoading(false);
    }
  }, [trades]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary p-3 rounded-md shadow-md border border-border">
          <p className="text-sm font-semibold">{label}</p>
          <p className={`text-sm ${payload[0].value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            P&L: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  if (loading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Journalier</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="pnl" 
              name="P&L" 
              fill={(d) => d.pnl >= 0 ? '#4ade80' : '#f87171'}
              shape={(props: any) => {
                const { x, y, width, height, pnl } = props;
                const color = pnl >= 0 ? '#4ade80' : '#f87171';
                return <rect x={x} y={y} width={width} height={height} fill={color} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
