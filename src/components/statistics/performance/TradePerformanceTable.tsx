
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStartDateFromTimeframe } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TradePerformanceTableProps {
  userId?: string;
  period: string;
}

interface TradePerformance {
  category: string;
  totalTrades: number;
  winRate: number;
  averagePnL: number;
  totalPnL: number;
  bestTrade: number;
  worstTrade: number;
}

export default function TradePerformanceTable({ userId, period }: TradePerformanceTableProps) {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<TradePerformance[]>([]);
  
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setPerformanceData(getMockData());
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const startDate = getStartDateFromTimeframe(period);
        
        const { data: trades, error } = await supabase
          .from("trades")
          .select("*")
          .eq("user_id", userId)
          .gte("date", startDate.toISOString());
          
        if (error) throw error;
        
        if (!trades || trades.length === 0) {
          setPerformanceData(getMockData());
          setLoading(false);
          return;
        }
        
        // Analyze by strategy
        const strategies: Record<string, TradePerformance> = {};
        
        trades.forEach(trade => {
          const strategy = trade.strategy || "Non définie";
          
          if (!strategies[strategy]) {
            strategies[strategy] = {
              category: strategy,
              totalTrades: 0,
              winRate: 0,
              averagePnL: 0,
              totalPnL: 0,
              bestTrade: -Infinity,
              worstTrade: Infinity
            };
          }
          
          strategies[strategy].totalTrades += 1;
          strategies[strategy].totalPnL += (trade.pnl || 0);
          
          if (trade.pnl > 0) {
            strategies[strategy].winRate += 1;
          }
          
          strategies[strategy].bestTrade = Math.max(strategies[strategy].bestTrade, trade.pnl || 0);
          strategies[strategy].worstTrade = Math.min(strategies[strategy].worstTrade, trade.pnl || 0);
        });
        
        // Calculate final metrics
        Object.values(strategies).forEach(strategy => {
          strategy.winRate = Math.round((strategy.winRate / strategy.totalTrades) * 100);
          strategy.averagePnL = strategy.totalPnL / strategy.totalTrades;
          
          // Handle edge cases for best/worst trade
          if (strategy.bestTrade === -Infinity) strategy.bestTrade = 0;
          if (strategy.worstTrade === Infinity) strategy.worstTrade = 0;
        });
        
        // Sort by total P&L descending
        const sortedData = Object.values(strategies).sort((a, b) => b.totalPnL - a.totalPnL);
        setPerformanceData(sortedData);
      } catch (err) {
        console.error("Error fetching trade performance data:", err);
        setPerformanceData(getMockData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, period]);
  
  const getMockData = (): TradePerformance[] => {
    return [
      {
        category: "Breakout",
        totalTrades: 24,
        winRate: 75,
        averagePnL: 116.67,
        totalPnL: 2800,
        bestTrade: 450,
        worstTrade: -120
      },
      {
        category: "Trend-Following",
        totalTrades: 18,
        winRate: 67,
        averagePnL: 83.33,
        totalPnL: 1500,
        bestTrade: 380,
        worstTrade: -200
      },
      {
        category: "Swing",
        totalTrades: 14,
        winRate: 57,
        averagePnL: 64.29,
        totalPnL: 900,
        bestTrade: 320,
        worstTrade: -180
      },
      {
        category: "Scalping",
        totalTrades: 22,
        winRate: 55,
        averagePnL: 54.55,
        totalPnL: 1200,
        bestTrade: 220,
        worstTrade: -150
      },
      {
        category: "Position",
        totalTrades: 12,
        winRate: 83,
        averagePnL: 166.67,
        totalPnL: 2000,
        bestTrade: 520,
        worstTrade: -100
      }
    ];
  };
  
  if (loading) {
    return <Skeleton className="w-full h-[400px]" />;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stratégie</TableHead>
            <TableHead className="text-right">Trades</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">P&L Moyen</TableHead>
            <TableHead className="text-right">P&L Total</TableHead>
            <TableHead className="text-right">Meilleur Trade</TableHead>
            <TableHead className="text-right">Pire Trade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performanceData.map((item) => (
            <TableRow key={item.category}>
              <TableCell className="font-medium">{item.category}</TableCell>
              <TableCell className="text-right">{item.totalTrades}</TableCell>
              <TableCell className="text-right">{item.winRate}%</TableCell>
              <TableCell className="text-right">{formatCurrency(item.averagePnL)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(item.totalPnL)}</TableCell>
              <TableCell className="text-right text-profit">{formatCurrency(item.bestTrade)}</TableCell>
              <TableCell className="text-right text-loss">{formatCurrency(item.worstTrade)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
