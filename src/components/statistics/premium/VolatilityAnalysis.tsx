
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export function VolatilityAnalysis() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const { trades } = useTradesFetcher(user?.id, 'all');
  
  useEffect(() => {
    if (trades.length > 0) {
      // Calculate daily volatility based on trades
      const tradesByDate: Record<string, number[]> = {};
      
      trades.forEach(trade => {
        const date = new Date(trade.date).toISOString().split('T')[0];
        if (!tradesByDate[date]) {
          tradesByDate[date] = [];
        }
        tradesByDate[date].push(Number(trade.pnl) || 0);
      });
      
      // Calculate volatility as standard deviation of daily PnLs
      const volatilityData = Object.entries(tradesByDate).map(([date, pnls]) => {
        const average = pnls.reduce((sum, val) => sum + val, 0) / pnls.length;
        const squareDiffs = pnls.map(value => Math.pow(value - average, 2));
        const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
        const stdDev = Math.sqrt(avgSquareDiff);
        
        return {
          date,
          volatility: Number(stdDev.toFixed(2)),
          trades: pnls.length
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setData(volatilityData);
      setLoading(false);
    } else {
      // Sample data when no trades are available
      const sampleData = [
        { date: '2025-01-01', volatility: 12.5, trades: 5 },
        { date: '2025-01-02', volatility: 14.2, trades: 3 },
        { date: '2025-01-03', volatility: 8.7, trades: 7 },
        { date: '2025-01-04', volatility: 10.3, trades: 4 },
        { date: '2025-01-05', volatility: 15.8, trades: 6 },
        { date: '2025-01-06', volatility: 11.2, trades: 8 },
        { date: '2025-01-07', volatility: 9.5, trades: 5 },
      ];
      setData(sampleData);
      setLoading(false);
    }
  }, [trades]);
  
  if (loading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse de Volatilité</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
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
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="volatility"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Volatilité"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trades"
              stroke="#82ca9d"
              name="Nb de trades"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
