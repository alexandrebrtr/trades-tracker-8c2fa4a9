
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_CONFIG } from "./chartConfig";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function RiskReturnScatter() {
  const [loading, setLoading] = useState(true);
  const [riskReturnData, setRiskReturnData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRiskReturnData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!trades || trades.length === 0) {
          setLoading(false);
          return;
        }

        // Process trades to get risk/return data by symbol
        const riskReturnBySymbol = calculateRiskReturnBySymbol(trades);
        setRiskReturnData(riskReturnBySymbol);
        
      } catch (err) {
        console.error("Error fetching risk/return data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskReturnData();
  }, [user]);

  const calculateRiskReturnBySymbol = (trades: any[]) => {
    // Group trades by symbol
    const symbolData: Record<string, { returns: number[], totalPnL: number, count: number }> = {};
    
    trades.forEach(trade => {
      const symbol = trade.symbol || 'Inconnu';
      
      if (!symbolData[symbol]) {
        symbolData[symbol] = { returns: [], totalPnL: 0, count: 0 };
      }
      
      symbolData[symbol].returns.push(trade.pnl || 0);
      symbolData[symbol].totalPnL += (trade.pnl || 0);
      symbolData[symbol].count += 1;
    });
    
    // Calculate average return and risk (volatility) for each symbol
    return Object.entries(symbolData)
      .filter(([_, data]) => data.count >= 2)  // Need at least 2 trades to calculate volatility
      .map(([symbol, data]) => {
        const averageReturn = data.totalPnL / data.count;
        
        // Calculate volatility (standard deviation)
        const mean = data.returns.reduce((sum, val) => sum + val, 0) / data.returns.length;
        const variance = data.returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.returns.length;
        const volatility = Math.sqrt(variance);
        
        return {
          name: symbol,
          x: volatility, // Risk (volatility)
          y: averageReturn, // Return
          z: data.count, // Size (number of trades)
        };
      });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risque vs Rendement</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  // If no data, display a message
  if (riskReturnData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risque vs Rendement</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80">
          <p className="text-muted-foreground">
            Ajoutez plus de trades pour voir l'analyse risque-rendement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risque vs Rendement</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Risque" 
              label={{ value: 'Risque (Volatilité)', position: 'bottom' }} 
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Rendement" 
              label={{ value: 'Rendement', angle: -90, position: 'left' }} 
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[50, 400]} 
              name="Fréquence" 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              formatter={(value, name) => {
                if (name === 'Risque') return [`${parseFloat(value).toFixed(2)}`, name];
                if (name === 'Rendement') return [`${parseFloat(value).toFixed(2)} €`, name];
                if (name === 'Fréquence') return [value, 'Nombre de trades'];
                return [value, name];
              }}
            />
            <Legend />
            <Scatter 
              name="Symboles" 
              data={riskReturnData} 
              fill={CHART_CONFIG.primary.theme.light}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
