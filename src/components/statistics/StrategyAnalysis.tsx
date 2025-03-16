
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StrategyAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [strategyPerformanceData, setStrategyPerformanceData] = useState<any[]>([]);
  const [strategyCategoryData, setStrategyCategoryData] = useState<any[]>([]);
  const [timePerformanceData, setTimePerformanceData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Calculate start date based on selected timeframe
        const startDate = getStartDateFromTimeframe(selectedPeriod);
        
        // Fetch user trades
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });

        if (tradesError) throw tradesError;

        // Process trades data for analysis
        processTradesData(trades || []);
        
      } catch (error: any) {
        console.error('Error fetching analytics data:', error.message);
        // Use default data if we couldn't fetch user data
        useDefaultData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, selectedPeriod]);

  const getStartDateFromTimeframe = (tf: string): Date => {
    const now = new Date();
    switch (tf) {
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'all':
      default:
        return new Date(2000, 0, 1); // A date far in the past
    }
  };

  const processTradesData = (trades: any[]) => {
    if (!trades || trades.length === 0) {
      useDefaultData();
      return;
    }

    // Process strategy performance data
    const strategies: Record<string, { wins: number, losses: number, totalTrades: number, totalPnL: number }> = {};
    
    trades.forEach(trade => {
      const strategyName = trade.strategy || 'Non définie';
      
      if (!strategies[strategyName]) {
        strategies[strategyName] = { wins: 0, losses: 0, totalTrades: 0, totalPnL: 0 };
      }
      
      strategies[strategyName].totalTrades += 1;
      strategies[strategyName].totalPnL += (trade.pnl || 0);
      
      if (trade.pnl > 0) {
        strategies[strategyName].wins += 1;
      } else if (trade.pnl < 0) {
        strategies[strategyName].losses += 1;
      }
    });
    
    // Convert to array format for charts
    const performanceData = Object.entries(strategies).map(([name, data]) => ({
      name,
      winRate: data.totalTrades > 0 ? Math.round((data.wins / data.totalTrades) * 100) : 0,
      totalTrades: data.totalTrades,
      averagePnL: data.totalTrades > 0 ? Math.round(data.totalPnL / data.totalTrades) : 0
    }));
    
    setStrategyPerformanceData(performanceData.length > 0 ? performanceData : getDefaultPerformanceData());
    
    // Process strategy category data
    const categoryData = Object.entries(strategies).map(([name, data]) => ({
      name,
      value: data.totalTrades
    }));
    
    setStrategyCategoryData(categoryData.length > 0 ? categoryData : getDefaultCategoryData());
    
    // Process time performance data
    const monthlyPerformance: Record<string, Record<string, number>> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize data structure
    months.forEach(month => {
      monthlyPerformance[month] = {};
      Object.keys(strategies).forEach(strategy => {
        monthlyPerformance[month][strategy] = 0;
      });
    });
    
    // Fill with actual data
    trades.forEach(trade => {
      if (!trade.strategy) return;
      
      const date = new Date(trade.date);
      const month = months[date.getMonth()];
      
      monthlyPerformance[month][trade.strategy] = 
        (monthlyPerformance[month][trade.strategy] || 0) + (trade.pnl || 0);
    });
    
    // Convert to array format for charts
    const timeData = months.map(month => {
      const monthData: any = { month };
      
      Object.entries(strategies).forEach(([strategy]) => {
        monthData[strategy] = Math.round(monthlyPerformance[month][strategy] || 0);
      });
      
      return monthData;
    });
    
    setTimePerformanceData(
      timeData.some(month => Object.keys(month).length > 1) ? 
      timeData : getDefaultTimePerformanceData()
    );
  };

  const useDefaultData = () => {
    setStrategyPerformanceData(getDefaultPerformanceData());
    setStrategyCategoryData(getDefaultCategoryData());
    setTimePerformanceData(getDefaultTimePerformanceData());
  };

  const getDefaultPerformanceData = () => [
    { name: 'Momentum', winRate: 68, totalTrades: 42, averagePnL: 320 },
    { name: 'Breakout', winRate: 52, totalTrades: 35, averagePnL: 180 },
    { name: 'Support/Resistance', winRate: 75, totalTrades: 28, averagePnL: 450 },
    { name: 'Swing Trading', winRate: 63, totalTrades: 30, averagePnL: 280 },
    { name: 'Trend Following', winRate: 71, totalTrades: 25, averagePnL: 390 },
  ];

  const getDefaultCategoryData = () => [
    { name: 'Momentum', value: 42 },
    { name: 'Breakout', value: 35 },
    { name: 'Support/Resistance', value: 28 },
    { name: 'Swing Trading', value: 30 },
    { name: 'Trend Following', value: 25 },
  ];

  const getDefaultTimePerformanceData = () => [
    { month: 'Jan', Momentum: 28, Breakout: -12, 'Support/Resistance': 40, 'Swing Trading': 15, 'Trend Following': 32 },
    { month: 'Feb', Momentum: -15, Breakout: 25, 'Support/Resistance': 35, 'Swing Trading': 22, 'Trend Following': 18 },
    { month: 'Mar', Momentum: 35, Breakout: 30, 'Support/Resistance': -10, 'Swing Trading': 42, 'Trend Following': 25 },
    { month: 'Apr', Momentum: 40, Breakout: 15, 'Support/Resistance': 28, 'Swing Trading': -18, 'Trend Following': 30 },
    { month: 'May', Momentum: 22, Breakout: -20, 'Support/Resistance': 45, 'Swing Trading': 30, 'Trend Following': 20 },
    { month: 'Jun', Momentum: -10, Breakout: 35, 'Support/Resistance': 30, 'Swing Trading': 25, 'Trend Following': -15 },
  ];

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analyse des Stratégies</h2>
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px]" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analyse des Stratégies</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Dernier mois</SelectItem>
            <SelectItem value="quarter">Dernier trimestre</SelectItem>
            <SelectItem value="year">Dernière année</SelectItem>
            <SelectItem value="all">Toutes les données</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance par Stratégie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={strategyPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="winRate" fill="#0088FE" name="Taux de réussite (%)" />
                <Bar dataKey="averagePnL" fill="#00C49F" name="P&L moyen (€)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Stratégies</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={strategyCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {strategyCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance dans le Temps par Stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={timePerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} €`, 'P&L']} />
              <Legend />
              {Object.keys(timePerformanceData[0] || {})
                .filter(key => key !== 'month')
                .map((strategy, index) => (
                  <Line 
                    key={strategy}
                    type="monotone" 
                    dataKey={strategy} 
                    stroke={COLORS[index % COLORS.length]} 
                    activeDot={{ r: 8 }} 
                  />
                ))
              }
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyAnalysis;
