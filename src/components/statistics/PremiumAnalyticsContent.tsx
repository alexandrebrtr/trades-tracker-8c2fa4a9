
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart,
  Area,
  LineChart,
  Line,
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
  ResponsiveContainer
} from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function PremiumAnalyticsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [strategyData, setStrategyData] = useState<any[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    sharpe: 0,
    sortino: 0,
    maxDrawdown: 0,
    annualROI: 0
  });

  useEffect(() => {
    const fetchTradeData = async () => {
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

        // Process performance data
        processPerformanceData(trades);

        // Process strategy data
        processStrategyData(trades);

        // Process asset data
        processAssetData(trades);

        // Calculate metrics
        calculateMetrics(trades);

      } catch (err) {
        console.error("Error fetching trade data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeData();
  }, [user]);

  const processPerformanceData = (trades: any[]) => {
    // Group by month
    const monthlyPerformance: Record<string, number> = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      if (!monthlyPerformance[monthYear]) {
        monthlyPerformance[monthYear] = 0;
      }
      
      monthlyPerformance[monthYear] += (trade.pnl || 0);
    });
    
    // Convert to array format for chart
    const chartData = Object.entries(monthlyPerformance).map(([date, value]) => ({
      date,
      value: Math.round(value)
    }));
    
    setPerformanceData(chartData);
  };

  const processStrategyData = (trades: any[]) => {
    // Group by strategy
    const strategies: Record<string, { success: number, trades: number }> = {};
    
    trades.forEach(trade => {
      const strategy = trade.strategy || "Non définie";
      
      if (!strategies[strategy]) {
        strategies[strategy] = { success: 0, trades: 0 };
      }
      
      strategies[strategy].trades += 1;
      if (trade.pnl > 0) {
        strategies[strategy].success += 1;
      }
    });
    
    // Convert to array format for chart
    const chartData = Object.entries(strategies).map(([name, data]) => ({
      name,
      success: Math.round((data.success / data.trades) * 100),
      trades: data.trades
    }));
    
    setStrategyData(chartData.length > 0 ? chartData : []);
  };

  const processAssetData = (trades: any[]) => {
    // Group by symbol
    const assets: Record<string, number> = {};
    
    trades.forEach(trade => {
      const symbol = trade.symbol || "Autre";
      
      if (!assets[symbol]) {
        assets[symbol] = 0;
      }
      
      assets[symbol] += Math.abs(trade.pnl || 0);
    });
    
    // Convert to array format for chart
    const chartData = Object.entries(assets)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    setAssetData(chartData.length > 0 ? chartData : []);
  };

  const calculateMetrics = (trades: any[]) => {
    // Calculate daily returns
    const dailyReturns: Record<string, number> = {};
    let cumulativeValue = 0;
    let peak = 0;
    let maxDrawdown = 0;
    
    trades.forEach(trade => {
      const date = new Date(trade.date).toISOString().split('T')[0];
      cumulativeValue += (trade.pnl || 0);
      
      if (!dailyReturns[date]) {
        dailyReturns[date] = 0;
      }
      
      dailyReturns[date] += (trade.pnl || 0);
      
      // Track peak and calculate drawdown
      if (cumulativeValue > peak) {
        peak = cumulativeValue;
      }
      
      const drawdown = peak > 0 ? ((peak - cumulativeValue) / peak) * 100 : 0;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });
    
    // Calculate returns array
    const returns = Object.values(dailyReturns);
    
    // Calculate mean return
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    
    // Calculate standard deviation of returns
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate downside deviation (for Sortino ratio)
    const downsideReturns = returns.filter(ret => ret < 0);
    const downsideVariance = downsideReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / returns.length;
    const downsideDeviation = Math.sqrt(downsideVariance);
    
    // Calculate Sharpe ratio (using risk-free rate of 0 for simplification)
    const sharpeRatio = stdDev !== 0 ? meanReturn / stdDev : 0;
    
    // Calculate Sortino ratio
    const sortinoRatio = downsideDeviation !== 0 ? meanReturn / downsideDeviation : 0;
    
    // Calculate annualized ROI (simple approximation)
    const firstTradeDate = new Date(trades[0].date);
    const lastTradeDate = new Date(trades[trades.length - 1].date);
    const daysDiff = (lastTradeDate.getTime() - firstTradeDate.getTime()) / (1000 * 60 * 60 * 24) || 1;
    const annualizedFactor = 365 / daysDiff;
    const totalReturn = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const annualizedROI = (totalReturn * annualizedFactor) / 10000 * 100; // Assuming 10000 initial capital
    
    setMetrics({
      sharpe: parseFloat(sharpeRatio.toFixed(2)),
      sortino: parseFloat(sortinoRatio.toFixed(2)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
      annualROI: parseFloat(annualizedROI.toFixed(1))
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  // If no data available, display message
  if (performanceData.length === 0 && strategyData.length === 0 && assetData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-secondary/10 rounded-lg p-6">
        <h3 className="text-xl font-medium mb-2">Aucune donnée disponible</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Ajoutez des trades à votre portefeuille pour voir apparaître des analyses détaillées ici.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {performanceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analyse de performance avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} €`, 'P&L']} />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {strategyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analyse par stratégie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={strategyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" fill="#82ca9d" name="Taux de réussite (%)" />
                  <Bar dataKey="trades" fill="#8884d8" name="Nombre de trades" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assetData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Répartition des actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} €`, 'Volume']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Métriques avancées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Ratio de Sharpe</p>
                <p className="text-2xl font-bold">{metrics.sharpe}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Ratio de Sortino</p>
                <p className="text-2xl font-bold">{metrics.sortino}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Drawdown Maximum</p>
                <p className="text-2xl font-bold text-destructive">-{metrics.maxDrawdown}%</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">ROI Annualisé</p>
                <p className={`text-2xl font-bold ${metrics.annualROI >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.annualROI >= 0 ? '+' : ''}{metrics.annualROI}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
