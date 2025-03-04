
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-xs text-muted-foreground/90 mb-1">{label}</p>
        <p className="text-sm font-semibold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

interface PerformanceChartProps {
  className?: string;
  timeframe?: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  userId?: string;
}

export function PerformanceChart({ className, timeframe = '1M', userId }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [isPositive, setIsPositive] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>(timeframe);

  // Récupérer les données basées sur l'utilisateur et la période sélectionnée
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        // Générer des données fictives si aucun utilisateur n'est connecté
        const mockData = generateMockData(selectedTimeframe);
        setData(mockData);
        setIsPositive(mockData[mockData.length - 1].value >= mockData[0].value);
        return;
      }

      try {
        // Déterminer la date de début en fonction de la période sélectionnée
        const startDate = getStartDateForTimeframe(selectedTimeframe);
        
        // Récupérer les trades de l'utilisateur pour la période
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });

        if (error) throw error;

        if (!trades || trades.length === 0) {
          // Aucun trade pour cette période, utiliser des données fictives
          const mockData = generateMockData(selectedTimeframe);
          setData(mockData);
          setIsPositive(true);
          return;
        }

        // Récupérer le solde du portfolio
        const { data: portfolios, error: portfolioError } = await supabase
          .from('portfolios')
          .select('balance')
          .eq('user_id', userId)
          .limit(1);

        if (portfolioError) throw portfolioError;

        const initialBalance = portfolios && portfolios.length > 0 ? portfolios[0].balance : 10000;
        
        // Générer une série temporelle avec le solde après chaque trade
        const performanceData = generatePerformanceData(trades, initialBalance, selectedTimeframe);
        
        setData(performanceData);
        setIsPositive(
          performanceData.length > 1 
          ? performanceData[performanceData.length - 1].value >= performanceData[0].value 
          : true
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des données de performance:', error);
        // En cas d'erreur, utiliser des données fictives
        const mockData = generateMockData(selectedTimeframe);
        setData(mockData);
        setIsPositive(mockData[mockData.length - 1].value >= mockData[0].value);
      }
    };

    fetchData();
  }, [userId, selectedTimeframe]);

  // Helper function to generate performance data from trades
  const generatePerformanceData = (trades: any[], initialBalance: number, timeframe: string) => {
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

  // Helper function to create a time scale for the selected timeframe
  const createTimeScale = (timeframe: string) => {
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

  // Helper function to get start date based on timeframe
  const getStartDateForTimeframe = (timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => {
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

  // Mock data for initial render or when no trades are available
  const generateMockData = (timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => {
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

  // Format numbers as currency
  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  return (
    <div className={`glass-card ${className}`}>
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">Performance du compte</h3>
        <div className="flex space-x-2">
          {(['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
            <button
              key={period}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedTimeframe === period 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
              }`}
              onClick={() => setSelectedTimeframe(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? '#34d399' : '#ef4444'} 
                  stopOpacity={0.2} 
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? '#34d399' : '#ef4444'} 
                  stopOpacity={0} 
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#f0f0f0' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#34d399' : '#ef4444'} 
              fillOpacity={1}
              fill="url(#colorValue)" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
