
import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';

export function RiskReturnScatter() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const { trades } = useTradesFetcher(user?.id, 'all');
  
  useEffect(() => {
    if (trades.length > 0) {
      // Group trades by strategy
      const strategiesMap: Record<string, { pnls: number[], totalTrades: number }> = {};
      
      trades.forEach(trade => {
        const strategy = trade.strategy || 'Indéfini';
        const pnl = Number(trade.pnl) || 0;
        
        if (!strategiesMap[strategy]) {
          strategiesMap[strategy] = { pnls: [], totalTrades: 0 };
        }
        
        strategiesMap[strategy].pnls.push(pnl);
        strategiesMap[strategy].totalTrades += 1;
      });
      
      // Calculate risk and return metrics for each strategy
      const scatterData = Object.entries(strategiesMap).map(([strategy, data]) => {
        const avgReturn = data.pnls.reduce((sum, pnl) => sum + pnl, 0) / data.pnls.length;
        
        // Calculate volatility (risk)
        const squaredDiffs = data.pnls.map(pnl => Math.pow(pnl - avgReturn, 2));
        const variance = squaredDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / data.pnls.length;
        const risk = Math.sqrt(variance); // Standard deviation
        
        return {
          strategy,
          risk: Number(risk.toFixed(2)),
          return: Number(avgReturn.toFixed(2)),
          trades: data.totalTrades
        };
      });
      
      setData(scatterData);
      setLoading(false);
    } else {
      // Sample data when no trades are available
      const sampleData = [
        { strategy: 'Breakout', risk: 120, return: 85, trades: 24 },
        { strategy: 'Trend Following', risk: 180, return: 150, trades: 18 },
        { strategy: 'Mean Reversion', risk: 90, return: 65, trades: 32 },
        { strategy: 'Momentum', risk: 200, return: 180, trades: 14 },
        { strategy: 'Scalping', risk: 40, return: 30, trades: 65 },
      ];
      setData(sampleData);
      setLoading(false);
    }
  }, [trades]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-secondary p-3 rounded-md shadow-md border border-border">
          <p className="text-sm font-semibold">{data.strategy}</p>
          <p className="text-sm">Risque: {formatCurrency(data.risk)}</p>
          <p className="text-sm">Rendement: {formatCurrency(data.return)}</p>
          <p className="text-sm">Trades: {data.trades}</p>
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
        <CardTitle>Analyse Risque/Rendement</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              dataKey="risk" 
              name="Risque" 
              label={{ value: 'Risque', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="return" 
              name="Rendement"
              label={{ value: 'Rendement', angle: -90, position: 'insideLeft' }} 
            />
            <ZAxis type="number" dataKey="trades" range={[50, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Legend />
            <Scatter name="Stratégies" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
