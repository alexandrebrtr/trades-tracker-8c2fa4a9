
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

  try {
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate cumulative returns
    let cumulativeValue = 0;
    const months: Record<string, number> = {};
    const cumulativeData: any[] = [];
    
    // Ensure we have a data point for each month between first and last trade
    const firstDate = new Date(sortedTrades[0].date);
    const lastDate = new Date(sortedTrades[sortedTrades.length - 1].date);
    
    // Create a date iterator to fill in cumulative data
    const currentDate = new Date(firstDate);
    currentDate.setDate(1); // Start at the beginning of the month
    
    // Create a complete timeline for the cumulative chart
    while (currentDate <= lastDate) {
      const monthYearKey = currentDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      cumulativeData.push({
        date: monthYearKey,
        return: cumulativeValue
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Process trades and update the cumulative data
    sortedTrades.forEach(trade => {
      // Update cumulative value
      cumulativeValue += (trade.pnl || 0);
      
      // Get the month-year for this trade
      const date = new Date(trade.date);
      const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      
      // Find and update the corresponding point in our timeline
      const dataPoint = cumulativeData.find(point => point.date === monthYear);
      if (dataPoint) {
        dataPoint.return = Math.round(cumulativeValue);
      }
      
      // For monthly chart data
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      months[monthKey] = (months[monthKey] || 0) + (trade.pnl || 0);
    });

    // Convert monthly data to array for the bar chart
    const monthlyData = Object.entries(months).map(([month, value]) => ({
      month,
      return: Math.round(value)
    }));

    // Calculate volatility data
    const volatilityData = calculateVolatility(sortedTrades);

    // Calculate performance metrics
    const metrics = calculateMetrics(sortedTrades);

    return {
      cumulativeReturnsData: cumulativeData,
      monthlyReturnsData: monthlyData,
      volatilityData,
      metrics
    };
  } catch (error) {
    console.error("Error processing trade data:", error);
    // Return empty data on error
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
};
