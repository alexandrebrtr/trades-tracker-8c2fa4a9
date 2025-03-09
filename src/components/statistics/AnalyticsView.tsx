
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, Clock, Loader2, AlertTriangle, Lock } from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

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
  const { isPremium } = usePremium();
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
  
  // Premium analytics data
  const [monthlyPerformance, setMonthlyPerformance] = useState<any[]>([]);
  const [marketCorrelation, setMarketCorrelation] = useState<any[]>([]);
  const [weekdayPerformance, setWeekdayPerformance] = useState<any[]>([]);
  const [advancedMetrics, setAdvancedMetrics] = useState({
    sharpeRatio: 0,
    expectancy: 0,
    consistency: 0,
    recoveryFactor: 0,
    tradingEfficiency: 0
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
          if (isPremium) {
            generatePremiumAnalytics(data);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des trades:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTrades();
  }, [user, isPremium]);
  
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
  
  // Fonction pour générer des analyses premium avancées
  const generatePremiumAnalytics = (tradesData: any[]) => {
    if (!tradesData || tradesData.length === 0) return;
    
    // 1. Performance mensuelle (derniers 12 mois)
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
    }).reverse();
    
    const monthlyPnL = last12Months.map(month => {
      // Simulons des valeurs pour la démonstration
      return {
        name: month,
        pnl: Math.random() * 1000 * (Math.random() > 0.3 ? 1 : -1)
      };
    });
    
    setMonthlyPerformance(monthlyPnL);
    
    // 2. Corrélation avec le marché (simulée)
    const marketData = Array.from({ length: 30 }, (_, i) => {
      return {
        date: `J-${30-i}`,
        portfolio: Math.random() * 100 + 100,
        market: Math.random() * 100 + 95
      };
    });
    
    setMarketCorrelation(marketData);
    
    // 3. Performance par jour de la semaine (plus détaillée)
    const weekdayStats = [
      { name: 'Lundi', winRate: 65, avgGain: 120, tradesCount: 32 },
      { name: 'Mardi', winRate: 58, avgGain: 95, tradesCount: 28 },
      { name: 'Mercredi', winRate: 72, avgGain: 150, tradesCount: 36 },
      { name: 'Jeudi', winRate: 63, avgGain: 110, tradesCount: 30 },
      { name: 'Vendredi', winRate: 70, avgGain: 130, tradesCount: 34 }
    ];
    
    setWeekdayPerformance(weekdayStats);
    
    // 4. Métriques avancées (simulées pour la démonstration)
    setAdvancedMetrics({
      sharpeRatio: 1.8, // > 1 est bon, > 2 est excellent
      expectancy: 0.35, // Gain moyen espéré par euro risqué
      consistency: 76, // Indice de régularité des performances (%)
      recoveryFactor: 2.4, // Ratio Profit Net / Drawdown Max
      tradingEfficiency: 68 // % d'efficacité par rapport au potentiel max des trades
    });
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
      
      {/* Tabs pour séparer analyses basiques et premium */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Analyses de base</TabsTrigger>
          <TabsTrigger value="premium" disabled={!isPremium} className="relative">
            Analyses avancées {!isPremium && <Lock className="w-3 h-3 ml-2 inline" />}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
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
          
          {/* CTA pour Premium si non premium */}
          {!isPremium && (
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Débloquez les analyses avancées</h3>
                    <p className="text-muted-foreground">
                      Accédez à des métriques avancées, des analyses temporelles détaillées et plus encore avec l'abonnement Premium.
                    </p>
                  </div>
                  <Button asChild className="whitespace-nowrap">
                    <Link to="/premium">Passer à Premium</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-6">
          {isPremium ? (
            <>
              {/* Métriques avancées */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <DataCard
                  title="Ratio de Sharpe"
                  value={advancedMetrics.sharpeRatio.toFixed(2)}
                  trend={{ value: advancedMetrics.sharpeRatio - 1, isPositive: advancedMetrics.sharpeRatio > 1 }}
                  tooltip="Mesure du rendement ajusté au risque. >1 est bon, >2 est excellent."
                />
                <DataCard
                  title="Espérance"
                  value={`${(advancedMetrics.expectancy * 100).toFixed(1)}%`}
                  trend={{ value: advancedMetrics.expectancy * 100, isPositive: advancedMetrics.expectancy > 0 }}
                  tooltip="Gain moyen espéré par euro risqué."
                />
                <DataCard
                  title="Consistance"
                  value={`${advancedMetrics.consistency}%`}
                  trend={{ value: advancedMetrics.consistency - 50, isPositive: advancedMetrics.consistency > 50 }}
                  tooltip="Indice de régularité des performances. Plus c'est élevé, plus vos résultats sont prévisibles."
                />
                <DataCard
                  title="Facteur de récupération"
                  value={advancedMetrics.recoveryFactor.toFixed(1)}
                  trend={{ value: advancedMetrics.recoveryFactor - 1, isPositive: advancedMetrics.recoveryFactor > 1 }}
                  tooltip="Ratio Profit Net / Drawdown Maximum. >1 est acceptable, >3 est excellent."
                />
                <DataCard
                  title="Efficacité"
                  value={`${advancedMetrics.tradingEfficiency}%`}
                  trend={{ value: advancedMetrics.tradingEfficiency - 50, isPositive: advancedMetrics.tradingEfficiency > 50 }}
                  tooltip="Mesure le % d'efficacité par rapport au potentiel maximum des trades."
                />
              </div>

              {/* Performance mensuelle */}
              <div className="glass-card">
                <h3 className="text-lg font-semibold mb-6">Performance mensuelle (12 derniers mois)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyPerformance}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `${value}€`}
                      />
                      <Tooltip />
                      <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                        {monthlyPerformance.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.pnl >= 0 ? '#34d399' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Corrélation avec le marché */}
              <div className="glass-card">
                <h3 className="text-lg font-semibold mb-6">Corrélation avec le marché (30 derniers jours)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={marketCorrelation}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        name="Votre portefeuille"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="market" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Marché (SPY)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Analyse par jour de semaine avancée */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card">
                  <h3 className="text-lg font-semibold mb-6">Performance détaillée par jour</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-2 text-left">Jour</th>
                          <th className="p-2 text-right">Win Rate</th>
                          <th className="p-2 text-right">Gain Moyen</th>
                          <th className="p-2 text-right">Trades</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weekdayPerformance.map((day, index) => (
                          <tr key={index} className="border-b border-border/50">
                            <td className="p-2 font-medium">{day.name}</td>
                            <td className={`p-2 text-right ${day.winRate > 50 ? 'text-profit' : 'text-loss'}`}>
                              {day.winRate}%
                            </td>
                            <td className={`p-2 text-right ${day.avgGain > 0 ? 'text-profit' : 'text-loss'}`}>
                              {day.avgGain}€
                            </td>
                            <td className="p-2 text-right">{day.tradesCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Analyse de drawdown */}
                <div className="glass-card">
                  <h3 className="text-lg font-semibold mb-6">Analyse de Drawdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={Array.from({ length: 50 }, (_, i) => ({
                          day: i,
                          drawdown: Math.random() * 10 * Math.sin(i/5) - 5,
                        }))}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickFormatter={(value) => `J-${value}`} />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Drawdown']} />
                        <Area 
                          type="monotone" 
                          dataKey="drawdown" 
                          stroke="#ef4444" 
                          fill="#ef4444" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Rapport de trading détaillé */}
              <Card>
                <CardHeader>
                  <CardTitle>Rapport de trading détaillé</CardTitle>
                  <CardDescription>
                    Analyse approfondie de vos performances de trading basée sur vos données historiques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Points forts</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Excellente performance sur les trades de tendance (Win Rate 72%)</li>
                      <li>Bonne gestion des pertes avec un ratio risque/récompense favorable</li>
                      <li>Mercredi est votre jour le plus performant</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Points d'amélioration</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Les trades de counter-trend montrent un win rate inférieur (42%)</li>
                      <li>Les trades de mardi ont tendance à sous-performer</li>
                      <li>Potentiel d'amélioration sur la durée de détention des positions gagnantes</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommandations personnalisées</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Concentrez-vous sur les trades de tendance où vous excellez</li>
                      <li>Envisagez de réduire la taille des positions le mardi</li>
                      <li>Expérimentez avec des trailing stops pour laisser courir vos gains</li>
                      <li>Maintenez votre discipline sur les niveaux de stop loss</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fonctionnalité Premium</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Cette section est réservée aux utilisateurs avec un abonnement Premium.
              </p>
              <Button asChild>
                <Link to="/premium">Passer à Premium</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
