
export const getStartDateForTimeframe = (timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => {
  const now = new Date();
  
  switch (timeframe) {
    case '1W':
      return new Date(now.setDate(now.getDate() - 7));
    case '1M':
      return new Date(now.setMonth(now.getMonth() - 1));
    case '3M':
      return new Date(now.setMonth(now.getMonth() - 3));
    case '6M':
      return new Date(now.setMonth(now.getMonth() - 6));
    case '1Y':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case 'ALL':
    default:
      // For 'ALL', we go back to 2000, which is effectively "all time"
      return new Date(2000, 0, 1); // January 1, 2000
  }
};

export const createTimeScale = (timeframe: string, startDate: Date, endDate: Date = new Date()) => {
  const dates = [];
  
  let currentDate = new Date(startDate);
  
  // Different date format based on timeframe
  let dateFormat: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
  
  // For longer timeframes, adjust format to prevent too many labels
  if (timeframe === '1Y' || timeframe === 'ALL') {
    dateFormat = { day: '2-digit', month: '2-digit', year: '2-digit' };
  }
  
  // Generate dates with appropriate intervals based on timeframe
  let interval = 1; // days
  if (timeframe === '1Y') interval = 7; // weekly for 1Y
  if (timeframe === 'ALL') interval = 30; // monthly for ALL
  
  while (currentDate <= endDate) {
    dates.push(currentDate.toLocaleDateString('fr-FR', dateFormat));
    currentDate.setDate(currentDate.getDate() + interval);
  }
  
  return dates;
};

export const generateMockData = (timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => {
  const data = [];
  const baseValue = 10000;
  let currentValue = baseValue;
  
  // Déterminer le nombre de points de données en fonction de la période
  let points;
  switch (timeframe) {
    case '1W': points = 7; break;
    case '1M': points = 30; break;
    case '3M': points = 90; break;
    case '6M': points = 180; break;
    case '1Y': points = 365; break;
    case 'ALL': points = 500; break;
    default: points = 30;
  }
  
  // Limiter le nombre de points pour une meilleure lisibilité
  const sampledPoints = Math.min(points, 30);
  const step = Math.max(1, Math.floor(points / sampledPoints));
  
  for (let i = 0; i < points; i += step) {
    const change = Math.random() > 0.4 
      ? Math.random() * 500 
      : -Math.random() * 300;
    
    currentValue += change;
    // Allow negative values
    
    // Calculer la date pour ce point
    const date = new Date();
    date.setDate(date.getDate() - (points - i));
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      value: Math.round(currentValue),
    });
  }
  
  return data;
};

export const generatePerformanceData = (trades: any[], initialBalance: number, timeframe: string) => {
  // Get start and end dates
  const startDate = getStartDateForTimeframe(timeframe as any);
  const endDate = new Date();
  
  // Create a map of trades by date
  const tradesByDay: Record<string, any[]> = {};
  
  trades.forEach(trade => {
    const date = new Date(trade.date);
    const dateKey = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: timeframe === 'ALL' ? '2-digit' : undefined
    });
    
    if (!tradesByDay[dateKey]) {
      tradesByDay[dateKey] = [];
    }
    
    tradesByDay[dateKey].push(trade);
  });
  
  // Create the time scale with appropriate interval based on timeframe
  const timeScale = createTimeScale(timeframe, startDate, endDate);
  
  // Generate the performance data
  let currentBalance = initialBalance;
  const performanceData = [];
  
  // First point is the initial balance at the start date
  performanceData.push({
    date: startDate.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: timeframe === 'ALL' ? '2-digit' : undefined
    }),
    value: currentBalance
  });
  
  // If there are no trades for the period or if it's a period with very few trades,
  // just create a flat line with the current balance
  if (Object.keys(tradesByDay).length === 0 || 
     (timeframe === '1W' || timeframe === '1M' || timeframe === 'ALL') && Object.keys(tradesByDay).length <= 1) {
    
    // Just add the end point with the same value to create a flat line
    performanceData.push({
      date: endDate.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        year: timeframe === 'ALL' ? '2-digit' : undefined 
      }),
      value: currentBalance
    });
    
    return performanceData;
  }
  
  // For ALL timeframe with multiple trades, we need a different approach to avoid too many data points
  if (timeframe === 'ALL' && Object.keys(tradesByDay).length > 1) {
    // Group trades by month for ALL timeframe
    const tradesByMonth: Record<string, any[]> = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthKey = date.toLocaleDateString('fr-FR', { month: '2-digit', year: '2-digit' });
      
      if (!tradesByMonth[monthKey]) {
        tradesByMonth[monthKey] = [];
      }
      
      tradesByMonth[monthKey].push(trade);
    });
    
    // Create a new timeline with monthly intervals
    const monthlyTimeScale = [];
    let currentMonth = new Date(startDate);
    
    while (currentMonth <= endDate) {
      monthlyTimeScale.push(currentMonth.toLocaleDateString('fr-FR', { month: '2-digit', year: '2-digit' }));
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    // Clear the performance data and reset
    performanceData.length = 0;
    currentBalance = initialBalance;
    
    // Add first point
    performanceData.push({
      date: startDate.toLocaleDateString('fr-FR', { month: '2-digit', year: '2-digit' }),
      value: currentBalance
    });
    
    // Process each month
    for (const monthKey of monthlyTimeScale) {
      if (tradesByMonth[monthKey]) {
        // Add the P&L of each trade for this month
        tradesByMonth[monthKey].forEach(trade => {
          currentBalance += (trade.pnl || 0);
        });
        
        // Add data point for this month
        performanceData.push({
          date: monthKey,
          value: currentBalance
        });
      } else if (performanceData.length > 0 && performanceData[performanceData.length - 1].date !== monthKey) {
        // If no trades for this month but we have a previous balance, carry it forward
        performanceData.push({
          date: monthKey,
          value: currentBalance
        });
      }
    }
    
    // Ensure the last point is today's date with current balance
    const todayKey = endDate.toLocaleDateString('fr-FR', { month: '2-digit', year: '2-digit' });
    if (performanceData.length > 0 && performanceData[performanceData.length - 1].date !== todayKey) {
      performanceData.push({
        date: todayKey,
        value: currentBalance
      });
    }
    
    return performanceData;
  }
  
  // Process each day in the time scale for non-ALL timeframes or ALL with few trades
  for (const dateKey of timeScale) {
    if (tradesByDay[dateKey]) {
      // Add the P&L of each trade for this date
      tradesByDay[dateKey].forEach(trade => {
        currentBalance += (trade.pnl || 0);
      });
      
      // Add data point for this date
      performanceData.push({
        date: dateKey,
        value: currentBalance
      });
    } else if (performanceData.length > 0 && performanceData[performanceData.length - 1].date !== dateKey) {
      // If no trades for this date but we have a previous balance, carry it forward
      performanceData.push({
        date: dateKey,
        value: currentBalance
      });
    }
  }
  
  // Ensure the last point is today's date with current balance
  const todayKey = endDate.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit',
    year: timeframe === 'ALL' ? '2-digit' : undefined
  });
  
  if (performanceData.length > 0 && performanceData[performanceData.length - 1].date !== todayKey) {
    performanceData.push({
      date: todayKey,
      value: currentBalance
    });
  }
  
  return performanceData;
};

export const formatYAxis = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};
