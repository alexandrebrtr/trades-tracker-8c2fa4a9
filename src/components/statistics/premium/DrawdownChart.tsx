
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CHART_CONFIG } from "./chartConfig";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function DrawdownChart() {
  const [loading, setLoading] = useState(true);
  const [drawdownData, setDrawdownData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDrawdownData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;

        if (!trades || trades.length === 0) {
          setLoading(false);
          return;
        }

        // Calculate drawdown series
        const drawdownSeries = calculateDrawdownSeries(trades);
        setDrawdownData(drawdownSeries);
        
      } catch (err) {
        console.error("Error fetching drawdown data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawdownData();
  }, [user]);

  const calculateDrawdownSeries = (trades: any[]) => {
    let cumulative = 0;
    let peak = 0;
    const drawdowns: any[] = [];
    
    // Group by month to make the chart more readable
    const monthlyData: Record<string, { balance: number, date: string }> = {};
    
    trades.forEach(trade => {
      cumulative += (trade.pnl || 0);
      
      const date = new Date(trade.date);
      const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { balance: cumulative, date: monthYear };
      } else {
        monthlyData[monthYear].balance = cumulative;
      }
    });
    
    // Calculate drawdowns from monthly data
    const monthlyValues = Object.values(monthlyData);
    
    monthlyValues.forEach((monthData) => {
      if (monthData.balance > peak) {
        peak = monthData.balance;
      }
      
      const drawdownPercent = peak !== 0 ? ((peak - monthData.balance) / peak) * 100 : 0;
      
      drawdowns.push({
        date: monthData.date,
        value: drawdownPercent.toFixed(2)
      });
    });
    
    return drawdowns;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse des Drawdowns</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  // If no data, display a message
  if (drawdownData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse des Drawdowns</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80">
          <p className="text-muted-foreground">
            Ajoutez des trades pour voir l'analyse des drawdowns.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des Drawdowns</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <AreaChart data={drawdownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 'dataMax + 5']} />
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'Drawdown']} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Drawdown" 
              stroke={CHART_CONFIG.danger.theme.light} 
              fill={CHART_CONFIG.danger.theme.light}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
