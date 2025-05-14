
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';

export function DrawdownChart() {
  const [data, setData] = useState<any[]>([]);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const { trades } = useTradesFetcher(user?.id, 'all');
  
  useEffect(() => {
    if (trades.length > 0) {
      // Sort trades by date
      const sortedTrades = [...trades].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Calculate cumulative P&L and drawdown
      let cumulativePnL = 0;
      let peak = 0;
      let currentDrawdown = 0;
      let maxDrawdownValue = 0;
      
      const chartData = sortedTrades.map((trade, index) => {
        const pnl = Number(trade.pnl) || 0;
        cumulativePnL += pnl;
        
        // Update peak if we have a new high
        if (cumulativePnL > peak) {
          peak = cumulativePnL;
          currentDrawdown = 0;
        } else {
          // Calculate current drawdown
          currentDrawdown = peak - cumulativePnL;
        }
        
        // Update max drawdown if needed
        if (currentDrawdown > maxDrawdownValue) {
          maxDrawdownValue = currentDrawdown;
        }
        
        return {
          date: new Date(trade.date).toISOString().split('T')[0],
          drawdown: -currentDrawdown, // Negative to show it going down on chart
          pnl: cumulativePnL
        };
      });
      
      setData(chartData);
      setMaxDrawdown(maxDrawdownValue);
      setLoading(false);
    } else {
      // Sample data when no trades are available
      const sampleData = [
        { date: '2025-01-01', drawdown: 0, pnl: 0 },
        { date: '2025-01-02', drawdown: -120, pnl: 350 },
        { date: '2025-01-03', drawdown: -80, pnl: 650 },
        { date: '2025-01-04', drawdown: -220, pnl: 430 },
        { date: '2025-01-05', drawdown: -350, pnl: 300 },
        { date: '2025-01-06', drawdown: -150, pnl: 500 },
        { date: '2025-01-07', drawdown: 0, pnl: 800 },
      ];
      setData(sampleData);
      setMaxDrawdown(350);
      setLoading(false);
    }
  }, [trades]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary p-3 rounded-md shadow-md border border-border">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-red-500">
            Drawdown: {formatCurrency(Math.abs(payload[0].value))}
          </p>
          <p className="text-sm">
            P&L cumulé: {formatCurrency(payload[1].value)}
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
        <CardTitle>Analyse des Drawdowns</CardTitle>
        <CardDescription>
          Drawdown Max: {formatCurrency(maxDrawdown)}
        </CardDescription>
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
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="drawdown" 
              stroke="#f87171" 
              name="Drawdown"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="pnl" 
              stroke="#60a5fa" 
              name="P&L Cumulé" 
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
