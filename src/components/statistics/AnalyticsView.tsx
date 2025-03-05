
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className={`text-sm font-semibold ${payload[0].value >= 0 ? 'text-profit' : 'text-loss'}`}>
          {payload[0].value >= 0 ? '+' : ''}{payload[0].value} €
        </p>
      </div>
    );
  }
  return null;
};

// Time tooltip
const TimeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm font-semibold">{payload[0].value}% des trades</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f97316', '#2dd4bf', '#fbbf24'];

export function AnalyticsView() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1M');
  
  // Derived data
  const [dailyProfitData, setDailyProfitData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [strategyData, setStrategyData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    winRate: 0,
    profitFactor: 0,
    maxDrawdown: 0,
    riskRewardRatio: 0
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchUserTrades = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setTrades(data);
          processTradeData(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des trades:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTrades();
  }, [user]);
  
  const processTradeData = (tradesData: any[]) => {
    if (!tradesData || tradesData.length === 0) {
      return;
    }
    
    // Calculer les statistiques
    const winningTrades = tradesData.filter(trade => trade.pnl > 0);
    const losingTrades = tradesData.filter(trade => trade.pnl < 0);
    
    const winRate = (winningTrades.length / tradesData.length) * 100;
    
    const totalGains = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
    
    const profitFactor = totalLosses === 0 ? totalGains : totalGains / totalLosses;
    
    // Calcul simplifié du drawdown
    const sortedByDate = [...tradesData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let maxBalance = 0;
    let maxDrawdown = 0;
    let currentBalance = 0;
    
    for (const trade of sortedByDate) {
      currentBalance += trade.pnl;
      if (currentBalance > maxBalance) {
        maxBalance = currentBalance;
      }
      
      const currentDrawdown = maxBalance > 0 ? (maxBalance - currentBalance) / maxBalance * 100 : 0;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    }
    
    // Calcul du ratio risque/récompense (moyenne des gains / moyenne des pertes)
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length 
      : 0;
    
    const avgLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length)
      : 1;
    
    const riskRewardRatio = avgLoss === 0 ? 0 : avgWin / avgLoss;
    
    setStats({
      winRate,
      profitFactor,
      maxDrawdown,
      riskRewardRatio
    });
    
    // Répartition par jour de la semaine
    const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const profitByDay: Record<string, number> = {};
    
    // Initialiser tous les jours à 0
    daysOfWeek.forEach(day => {
      profitByDay[day] = 0;
    });
    
    // Calculer le profit par jour
    tradesData.forEach(trade => {
      const date = new Date(trade.date);
      const day = daysOfWeek[date.getDay()];
      profitByDay[day] += trade.pnl;
    });
    
    const dailyData = Object.keys(profitByDay).map(day => ({
      day,
      value: Math.round(profitByDay[day] * 100) / 100 // Arrondir à 2 décimales
    }));
    
    // Réorganiser les jours pour commencer par lundi
    const orderedDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const orderedData = orderedDays.map(day => 
      dailyData.find(d => d.day === day) || { day, value: 0 }
    );
    
    setDailyProfitData(orderedData);
    
    // Répartition par stratégie
    const strategies: Record<string, number> = {};
    tradesData.forEach(trade => {
      if (trade.strategy) {
        if (!strategies[trade.strategy]) {
          strategies[trade.strategy] = 0;
        }
        strategies[trade.strategy]++;
      }
    });
    
    const strategyDistribution = Object.entries(strategies).map(([name, count]) => ({
      name,
      value: Math.round((count / tradesData.length) * 100)
    }));
    
    setStrategyData(strategyDistribution);
    
    // Simuler la répartition par durée de trade (cette donnée n'est pas directement disponible)
    // Dans un cas réel, il faudrait calculer la différence entre date de sortie et date d'entrée
    setTimeData([
      { name: '<5m', value: 20 },
      { name: '5-15m', value: 30 },
      { name: '15-30m', value: 25 },
      { name: '30m-1h', value: 15 },
      { name: '1h-4h', value: 8 },
      { name: '>4h', value: 2 }
    ]);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement de vos statistiques...</p>
      </div>
    );
  }
  
  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg mb-4">Aucune donnée disponible</p>
        <p className="text-muted-foreground mb-8">
          Enregistrez vos premiers trades pour voir apparaître des statistiques détaillées.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          trend={stats.winRate > 50 ? { value: stats.winRate - 50, isPositive: true } : undefined}
        />
        
        <DataCard
          title="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          trend={stats.profitFactor > 1 ? { value: stats.profitFactor - 1, isPositive: true } : undefined}
        />
        
        <DataCard
          title="Drawdown Maximum"
          value={`${stats.maxDrawdown.toFixed(1)}%`}
          trend={{ value: stats.maxDrawdown, isPositive: false }}
          valueClassName="text-loss"
        />
        
        <DataCard
          title="Ratio Risque/Récompense"
          value={stats.riskRewardRatio.toFixed(2)}
          trend={stats.riskRewardRatio > 1 ? { value: stats.riskRewardRatio - 1, isPositive: true } : undefined}
        />
      </div>
      
      {/* Daily profit chart */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-6">Profits/Pertes par jour de la semaine</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyProfitData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `${value}€`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dailyProfitData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value >= 0 ? '#34d399' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Distribution charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trade duration distribution */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Durée moyenne des trades</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<TimeTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Strategy distribution */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Répartition par stratégie</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strategyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
