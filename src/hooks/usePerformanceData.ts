
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getDefaultData } from '@/utils/performanceUtils';

export const usePerformanceData = (user: any, selectedPeriod: string) => {
  const [loading, setLoading] = useState(true);
  const [cumulativeReturnsData, setCumulativeReturnsData] = useState<any[]>([]);
  const [monthlyReturnsData, setMonthlyReturnsData] = useState<any[]>([]);
  const [volatilityData, setVolatilityData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalReturn: 0,
    annualizedReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0,
    averageHoldingPeriod: "0 jours"
  });

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

        // Process trades data for analytics
        processTradesData(trades || []);
        
      } catch (error: any) {
        console.error('Error fetching analytics data:', error.message);
        // Use default data if there's an error
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

    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate cumulative returns
    let cumulativeValue = 0;
    const months: Record<string, number> = {};
    const cumulativeData: any[] = [];
    const monthlyData: any[] = [];

    sortedTrades.forEach(trade => {
      // For cumulative chart
      cumulativeValue += (trade.pnl || 0);
      const date = new Date(trade.date);
      const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      
      // Add to cumulative chart
      cumulativeData.push({
        date: monthYear,
        return: Math.round(cumulativeValue)
      });
      
      // For monthly chart
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short' });
      months[monthKey] = (months[monthKey] || 0) + (trade.pnl || 0);
    });

    // Convert monthly data to array
    Object.entries(months).forEach(([month, value]) => {
      monthlyData.push({
        month,
        return: Math.round(value)
      });
    });

    // Calculate volatility data
    const volatilityData = calculateVolatility(sortedTrades);

    // Calculate metrics
    const metrics = calculateMetrics(sortedTrades);

    // Set state with calculated data
    setCumulativeReturnsData(cumulativeData.length > 0 ? cumulativeData : getDefaultData().cumulativeReturnsData);
    setMonthlyReturnsData(monthlyData.length > 0 ? monthlyData : getDefaultData().monthlyReturnsData);
    setVolatilityData(volatilityData);
    setMetrics(metrics);
  };

  const calculateVolatility = (trades: any[]) => {
    // Group daily returns to calculate volatility across time horizons
    const dailyReturns: Record<string, number[]> = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyReturns[dateKey]) {
        dailyReturns[dateKey] = [];
      }
      
      dailyReturns[dateKey].push(trade.pnl || 0);
    });
    
    // Calculate volatility for different time horizons
    const timeHorizons = [
      { label: '1h', days: 1/24 },
      { label: '2h', days: 2/24 },
      { label: '3h', days: 3/24 },
      { label: '4h', days: 4/24 },
      { label: '1d', days: 1 },
      { label: '3d', days: 3 },
      { label: '1w', days: 7 },
      { label: '2w', days: 14 },
      { label: '1m', days: 30 },
      { label: '3m', days: 90 },
      { label: '6m', days: 180 },
      { label: '1y', days: 365 }
    ];
    
    const volatilityData = timeHorizons.map(horizon => {
      // Simulated volatility calculation - in a real system this would use rolling windows
      const scaling = Math.sqrt(horizon.days);
      const dailyVolatility = Object.values(dailyReturns).flat().length > 0 
        ? calculateStdDev(Object.values(dailyReturns).flat()) 
        : 1;
      
      return {
        time: horizon.label,
        volatility: parseFloat((dailyVolatility * scaling).toFixed(1))
      };
    });
    
    return volatilityData;
  };

  const calculateStdDev = (values: number[]) => {
    const n = values.length;
    if (n === 0) return 0;
    
    const mean = values.reduce((sum, value) => sum + value, 0) / n;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;
    
    return Math.sqrt(variance);
  };

  const calculateMetrics = (trades: any[]) => {
    if (trades.length === 0) {
      return {
        totalReturn: 0,
        annualizedReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        averageHoldingPeriod: "0 jours"
      };
    }
    
    // Total return
    const totalReturn = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    
    // Win rate
    const winningTrades = trades.filter(trade => trade.pnl > 0);
    const winRate = (winningTrades.length / trades.length) * 100;
    
    // Annualized return (simplified)
    const firstTradeDate = new Date(trades[0].date);
    const lastTradeDate = new Date(trades[trades.length - 1].date);
    const tradingDays = Math.max(1, (lastTradeDate.getTime() - firstTradeDate.getTime()) / (1000 * 60 * 60 * 24));
    const annualizedReturn = totalReturn > 0 
      ? (Math.pow(1 + totalReturn / 10000, 365 / tradingDays) - 1) * 100 
      : totalReturn / 100;
    
    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;
    
    trades.forEach(trade => {
      runningTotal += (trade.pnl || 0);
      
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      
      const drawdown = peak > 0 ? ((peak - runningTotal) / peak) * 100 : 0;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });
    
    // Sharpe ratio (simplified)
    const returns = trades.map(trade => trade.pnl || 0);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = calculateStdDev(returns);
    const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;
    
    // Average holding period
    const holdingPeriods = [];
    for (let i = 0; i < trades.length; i++) {
      if (trades[i].entry_date && trades[i].exit_date) {
        const entryDate = new Date(trades[i].entry_date);
        const exitDate = new Date(trades[i].exit_date);
        const days = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
        holdingPeriods.push(days);
      }
    }
    
    const avgHoldingPeriod = holdingPeriods.length > 0 
      ? holdingPeriods.reduce((sum, period) => sum + period, 0) / holdingPeriods.length 
      : 3.2; // Default value if no proper entry/exit dates
    
    return {
      totalReturn: Math.round(totalReturn),
      annualizedReturn: parseFloat(annualizedReturn.toFixed(1)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(1)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
      winRate: parseFloat(winRate.toFixed(1)),
      averageHoldingPeriod: `${avgHoldingPeriod.toFixed(1)} jours`
    };
  };

  const useDefaultData = () => {
    const defaultData = getDefaultData();
    setCumulativeReturnsData(defaultData.cumulativeReturnsData);
    setMonthlyReturnsData(defaultData.monthlyReturnsData);
    setVolatilityData(defaultData.volatilityData);
    setMetrics(defaultData.metrics);
  };

  return {
    loading,
    cumulativeReturnsData,
    monthlyReturnsData,
    volatilityData,
    metrics
  };
};
