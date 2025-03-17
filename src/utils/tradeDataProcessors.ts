
import { calculateMetrics, calculateVolatility } from './statsCalculations';
import { formatCurrency } from './formatters';

/**
 * Processes raw trade data into usable chart and metrics data
 */
export const processTradesData = (trades: any[]) => {
  if (!trades || trades.length === 0) {
    return {
      cumulativeReturnsData: [],
      monthlyReturnsData: [],
      volatilityData: [],
      metrics: {
        totalReturn: 0,
        annualizedReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        averageHoldingPeriod: "0 jours"
      }
    };
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

  return {
    cumulativeReturnsData: cumulativeData,
    monthlyReturnsData: monthlyData,
    volatilityData,
    metrics
  };
};
