
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
      return new Date(now.setFullYear(now.getFullYear() - 5));
  }
};

export const createTimeScale = (timeframe: string) => {
  const startDate = getStartDateForTimeframe(timeframe as any);
  const endDate = new Date();
  const dates = [];
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(currentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
    currentDate.setDate(currentDate.getDate() + 1);
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
    if (currentValue < 0) currentValue = 100; // Prevent negative values
    
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
  // Grouper les trades par jour
  const tradesByDay: Record<string, any[]> = {};
  
  trades.forEach(trade => {
    const date = new Date(trade.date);
    const dateKey = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    
    if (!tradesByDay[dateKey]) {
      tradesByDay[dateKey] = [];
    }
    
    tradesByDay[dateKey].push(trade);
  });
  
  // Créer l'échelle temporelle en fonction de la période
  const timeScale = createTimeScale(timeframe);
  
  // Générer les données avec le solde qui évolue
  let currentBalance = initialBalance;
  const performanceData = timeScale.map(dateKey => {
    if (tradesByDay[dateKey]) {
      // Ajouter les P&L des trades pour cette date
      tradesByDay[dateKey].forEach(trade => {
        currentBalance += (trade.pnl || 0);
      });
    }
    
    return {
      date: dateKey,
      value: currentBalance
    };
  });
  
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
