
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getStartDateFromTimeframe } from "@/utils/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#4CAF50", "#F44336", "#9C27B0", "#3F51B5"];

interface TradeAnalysisChartProps {
  type: "strategy" | "symbol" | "type";
  userId?: string;
  period: string;
  showAsBar?: boolean;
}

export default function TradeAnalysisChart({ type, userId, period, showAsBar = false }: TradeAnalysisChartProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setData(getMockData(type));
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
          setData(getMockData(type));
          setLoading(false);
          return;
        }
        
        // Group by requested type (strategy, symbol, or trade type)
        const groupedData: Record<string, { count: number, totalPnL: number, winCount: number }> = {};
        
        trades.forEach(trade => {
          const key = type === "strategy" 
            ? (trade.strategy || "Non définie") 
            : type === "symbol" 
              ? trade.symbol 
              : trade.type;
              
          if (!groupedData[key]) {
            groupedData[key] = { count: 0, totalPnL: 0, winCount: 0 };
          }
          
          groupedData[key].count += 1;
          groupedData[key].totalPnL += (trade.pnl || 0);
          if (trade.pnl > 0) {
            groupedData[key].winCount += 1;
          }
        });
        
        // Transform data for chart
        const chartData = Object.entries(groupedData).map(([name, stats]) => ({
          name,
          value: stats.count,
          pnl: stats.totalPnL,
          winRate: Math.round((stats.winCount / stats.count) * 100)
        }));
        
        setData(chartData);
      } catch (err) {
        console.error(`Error fetching ${type} analysis data:`, err);
        setData(getMockData(type));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, period, type]);
  
  const getMockData = (chartType: string) => {
    if (chartType === "strategy") {
      return [
        { name: "Breakout", value: 24, pnl: 2800, winRate: 75 },
        { name: "Trend-Following", value: 18, pnl: 1500, winRate: 67 },
        { name: "Swing", value: 14, pnl: 900, winRate: 57 },
        { name: "Scalping", value: 22, pnl: 1200, winRate: 55 },
        { name: "Position", value: 12, pnl: 2000, winRate: 83 }
      ];
    } else if (chartType === "symbol") {
      return [
        { name: "EURUSD", value: 30, pnl: 1200, winRate: 60 },
        { name: "USDJPY", value: 20, pnl: 800, winRate: 65 },
        { name: "BTCUSD", value: 15, pnl: 3500, winRate: 53 },
        { name: "ETHUSD", value: 10, pnl: 2000, winRate: 70 },
        { name: "XAUUSD", value: 25, pnl: 1500, winRate: 64 }
      ];
    } else {
      return [
        { name: "Long", value: 55, pnl: 4500, winRate: 65 },
        { name: "Short", value: 45, pnl: 3200, winRate: 60 }
      ];
    }
  };
  
  if (loading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  // Render appropriate chart based on data type and showAsBar preference
  const renderChart = () => {
    if (showAsBar) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="pnl" fill="#8884d8" name="P&L (€)" />
            <Bar yAxisId="right" dataKey="winRate" fill="#82ca9d" name="Win Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (data.length <= 5) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Nombre de trades" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return renderChart();
}
