
export const getDefaultData = () => {
  return {
    cumulativeReturnsData: [
      { date: 'Jan', return: 1000 },
      { date: 'Feb', return: 1300 },
      { date: 'Mar', return: 900 },
      { date: 'Apr', return: 1500 },
      { date: 'Mai', return: 1700 },
      { date: 'Juin', return: 1400 },
      { date: 'Juil', return: 2200 },
      { date: 'Août', return: 2800 },
      { date: 'Sep', return: 2500 },
      { date: 'Oct', return: 3000 },
      { date: 'Nov', return: 3200 },
      { date: 'Déc', return: 4000 },
    ],
    monthlyReturnsData: [
      { month: 'Jan', return: 300 },
      { month: 'Fév', return: 300 },
      { month: 'Mar', return: -400 },
      { month: 'Avr', return: 600 },
      { month: 'Mai', return: 200 },
      { month: 'Jun', return: -300 },
      { month: 'Jul', return: 800 },
      { month: 'Aoû', return: 600 },
      { month: 'Sep', return: -300 },
      { month: 'Oct', return: 500 },
      { month: 'Nov', return: 200 },
      { month: 'Déc', return: 800 },
    ],
    volatilityData: [
      { time: '1h', volatility: 0.8 },
      { time: '2h', volatility: 1.2 },
      { time: '3h', volatility: 0.9 },
      { time: '4h', volatility: 1.5 },
      { time: '1d', volatility: 2.1 },
      { time: '3d', volatility: 2.7 },
      { time: '1w', volatility: 3.2 },
      { time: '2w', volatility: 4.1 },
      { time: '1m', volatility: 5.3 },
      { time: '3m', volatility: 6.2 },
      { time: '6m', volatility: 7.1 },
      { time: '1y', volatility: 8.9 },
    ],
    metrics: {
      totalReturn: 4000,
      annualizedReturn: 28.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15.2,
      winRate: 68.5,
      averageHoldingPeriod: "3.2 jours"
    }
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(value);
};
