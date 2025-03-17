
import { useState, useEffect } from 'react';
import { useTradesFetcher } from './useTradesFetcher';
import { processTradesData } from '@/utils/tradeDataProcessors';
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

  const { isLoading, trades, error } = useTradesFetcher(user?.id, selectedPeriod);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    try {
      if (error || trades.length === 0) {
        useDefaultData();
        return;
      }

      // Process the trades data
      const processedData = processTradesData(trades);
      
      // Update state with calculated data
      setCumulativeReturnsData(processedData.cumulativeReturnsData.length > 0 
        ? processedData.cumulativeReturnsData 
        : getDefaultData().cumulativeReturnsData);
      
      setMonthlyReturnsData(processedData.monthlyReturnsData.length > 0 
        ? processedData.monthlyReturnsData 
        : getDefaultData().monthlyReturnsData);
      
      setVolatilityData(processedData.volatilityData);
      setMetrics(processedData.metrics);
    } catch (err) {
      console.error('Error processing performance data:', err);
      useDefaultData();
    } finally {
      setLoading(false);
    }
  }, [isLoading, trades, error]);

  const useDefaultData = () => {
    const defaultData = getDefaultData();
    setCumulativeReturnsData(defaultData.cumulativeReturnsData);
    setMonthlyReturnsData(defaultData.monthlyReturnsData);
    setVolatilityData(defaultData.volatilityData);
    setMetrics(defaultData.metrics);
    setLoading(false);
  };

  return {
    loading,
    cumulativeReturnsData,
    monthlyReturnsData,
    volatilityData,
    metrics
  };
};
