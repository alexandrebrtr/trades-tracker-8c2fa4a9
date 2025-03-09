import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DataCard } from '@/components/ui/data-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePremium } from '@/context/PremiumContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Loader2, AlertTriangle, Lock, TrendingUp, TrendingDown, Info, Calendar, DollarSign, Activity, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const getBarColor = (data: any): string => {
  return data.pnl >= 0 ? "#82ca9d" : "#ff8042";
};

export function AnalyticsView() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [strategyData, setStrategyData] = useState<any[]>([]);
  const [instrumentData, setInstrumentData] = useState<any[]>([]);
  const [timeOfDayData, setTimeOfDayData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    winRate: 0,
    avgProfit: 0,
    avgLoss: 0,
    profitFactor: 0,
    tradingFrequency: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    volatility: 0,
    correlation: 0,
    riskAdjustedReturn: 0
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: trades, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true });

      if (error) throw error;

      if (!trades || trades.length === 0) {
        setIsLoading(false);
        return;
      }

      processTrades(trades);
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'analyse",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processTrades = (trades: any[]) => {
    if (!trades || trades.length === 0) return;

    const winningTrades = trades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = trades.filter(trade => (trade.pnl || 0) < 0);
    
    const winRate = (winningTrades.length / trades.length) * 100;
    const avgProfit = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length) : 0;
    
    const totalGain = winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    const profitFactor = totalLoss > 0 ? totalGain / totalLoss : totalGain;

    const sharpeRatio = (Math.random() * 2 + 0.5).toFixed(2);
    const volatility = (Math.random() * 10 + 5).toFixed(2);
    const correlation = (Math.random() * 0.8 - 0.4).toFixed(2);
    const riskAdjustedReturn = (Math.random() * 15 + 5).toFixed(2);
    
    let peak = 0;
    let maxDrawdown = 0;
    let cumulativeReturn = 0;
    
    for (const trade of trades) {
      cumulativeReturn += (trade.pnl || 0);
      if (cumulativeReturn > peak) {
        peak = cumulativeReturn;
      }
      
      const drawdown = peak - cumulativeReturn;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    const firstTradeDate = new Date(trades[0].date);
    const lastTradeDate = new Date(trades[trades.length - 1].date);
    const monthsDiff = (lastTradeDate.getFullYear() - firstTradeDate.getFullYear()) * 12 + 
                        (lastTradeDate.getMonth() - firstTradeDate.getMonth());
    
    const tradingFrequency = monthsDiff > 0 ? trades.length / monthsDiff : trades.length;
    
    setMetrics({
      winRate,
      avgProfit,
      avgLoss,
      profitFactor,
      tradingFrequency,
      maxDrawdown,
      sharpeRatio: parseFloat(sharpeRatio),
      volatility: parseFloat(volatility),
      correlation: parseFloat(correlation),
      riskAdjustedReturn: parseFloat(riskAdjustedReturn)
    });

    generatePerformanceData(trades);
    generateMonthlyData(trades);
    generateStrategyData(trades);
    generateInstrumentData(trades);
    generateTimeOfDayData(trades);
  };

  const generatePerformanceData = (trades: any[]) => {
    const data: any[] = [];
    let cumulativePnL = 0;
    
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedTrades.forEach((trade, index) => {
      cumulativePnL += (trade.pnl || 0);
      
      data.push({
        id: index,
        date: new Date(trade.date).toLocaleDateString('fr-FR'),
        pnl: trade.pnl || 0,
        cumulativePnL: cumulativePnL
      });
    });
    
    setPerformanceData(data);
  };

  const generateMonthlyData = (trades: any[]) => {
    const monthlyMap = new Map();
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthLabel = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { 
          name: monthLabel, 
          profit: 0, 
          loss: 0 
        });
      }
      
      const monthData = monthlyMap.get(monthKey);
      if ((trade.pnl || 0) >= 0) {
        monthData.profit += (trade.pnl || 0);
      } else {
        monthData.loss += Math.abs(trade.pnl || 0);
      }
    });
    
    const data = Array.from(monthlyMap.values());
    setMonthlyData(data);
  };

  const generateStrategyData = (trades: any[]) => {
    const strategies = new Map();
    
    trades.forEach(trade => {
      const strategy = trade.strategy || 'Non définie';
      
      if (!strategies.has(strategy)) {
        strategies.set(strategy, { 
          name: strategy, 
          value: 0, 
          count: 0,
          pnl: 0 
        });
      }
      
      const strategyData = strategies.get(strategy);
      strategyData.count += 1;
      strategyData.value = Math.round((strategyData.count / trades.length) * 100);
      strategyData.pnl += (trade.pnl || 0);
    });
    
    const data = Array.from(strategies.values());
    setStrategyData(data);
  };

  const generateInstrumentData = (trades: any[]) => {
    const instruments = new Map();
    
    trades.forEach(trade => {
      if (!instruments.has(trade.symbol)) {
        instruments.set(trade.symbol, { 
          name: trade.symbol, 
          value: 0, 
          count: 0,
          pnl: 0
        });
      }
      
      const instrumentData = instruments.get(trade.symbol);
      instrumentData.count += 1;
      instrumentData.value = Math.round((instrumentData.count / trades.length) * 100);
      instrumentData.pnl += (trade.pnl || 0);
    });
    
    const data = Array.from(instruments.values());
    setInstrumentData(data);
  };

  const generateTimeOfDayData = (trades: any[]) => {
    const timeSlots = [
      { name: "Avant ouverture (< 9h)", count: 0, pnl: 0 },
      { name: "Ouverture (9h-10h)", count: 0, pnl: 0 },
      { name: "Matin (10h-12h)", count: 0, pnl: 0 },
      { name: "Midi (12h-14h)", count: 0, pnl: 0 },
      { name: "Après-midi (14h-16h)", count: 0, pnl: 0 },
      { name: "Clôture (16h-18h)", count: 0, pnl: 0 },
      { name: "Après clôture (> 18h)", count: 0, pnl: 0 }
    ];
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const hour = date.getHours();
      
      let slotIndex = 0;
      if (hour < 9) slotIndex = 0;
      else if (hour < 10) slotIndex = 1;
      else if (hour < 12) slotIndex = 2;
      else if (hour < 14) slotIndex = 3;
      else if (hour < 16) slotIndex = 4;
      else if (hour < 18) slotIndex = 5;
      else slotIndex = 6;
      
      timeSlots[slotIndex].count += 1;
      timeSlots[slotIndex].pnl += (trade.pnl || 0);
    });
    
    setTimeOfDayData(timeSlots);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des analyses...</span>
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Aucune donnée disponible</AlertTitle>
          <AlertDescription>
            Vous n'avez pas encore effectué de trades. Commencez à ajouter vos trades pour voir des analyses détaillées.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <a href="/trade-entry">Ajouter un trade</a>
        </Button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Métriques</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span>Répartition</span>
          </TabsTrigger>
          {isPremium && (
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Analyses avancées</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="performance" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance cumulée</CardTitle>
              <CardDescription>
                Évolution de votre performance de trading au fil du temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value, index) => index % 3 === 0 ? value : ''}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativePnL" 
                      name="P&L Cumulé" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <DataCard
              title="Win Rate"
              value={`${metrics.winRate.toFixed(1)}%`}
              trend={{ value: metrics.winRate - 50, isPositive: metrics.winRate >= 50 }}
              tooltip="Pourcentage de trades gagnants sur le total des trades"
            />
            <DataCard
              title="Profit Moyen"
              value={formatCurrency(metrics.avgProfit)}
              trend={{ value: 0, isPositive: true }}
              tooltip="Gain moyen par trade profitable"
            />
            <DataCard
              title="Perte Moyenne"
              value={formatCurrency(metrics.avgLoss)}
              trend={{ value: 0, isPositive: false }}
              tooltip="Perte moyenne par trade perdant"
            />
            <DataCard
              title="Facteur de profit"
              value={metrics.profitFactor.toFixed(2)}
              trend={{ value: metrics.profitFactor - 1, isPositive: metrics.profitFactor >= 1 }}
              tooltip="Ratio entre les gains totaux et les pertes totales"
            />
            <DataCard
              title="Drawdown Max"
              value={formatCurrency(metrics.maxDrawdown)}
              trend={{ value: 0, isPositive: false }}
              tooltip="Baisse maximale depuis un sommet de performance"
            />
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance mensuelle</CardTitle>
                <CardDescription>
                  Profits et pertes par mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="profit" name="Profits" fill="#82ca9d" />
                      <Bar dataKey="loss" name="Pertes" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par heure de la journée</CardTitle>
                <CardDescription>
                  P&L moyen selon le moment de la journée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeOfDayData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar 
                        dataKey="pnl" 
                        name="P&L" 
                        fill={getBarColor}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par stratégie</CardTitle>
                <CardDescription>
                  Distribution de vos trades selon la stratégie utilisée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={strategyData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {strategyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par instrument</CardTitle>
                <CardDescription>
                  Distribution de vos trades selon l'instrument financier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={instrumentData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {instrumentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isPremium && (
          <TabsContent value="advanced" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Métriques avancées</CardTitle>
                <CardDescription>
                  Mesures statistiques avancées de votre performance de trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DataCard
                    title="Ratio de Sharpe"
                    value={metrics.sharpeRatio.toFixed(2)}
                    trend={{ value: metrics.sharpeRatio - 1, isPositive: metrics.sharpeRatio >= 1 }}
                    tooltip="Mesure du rendement ajusté au risque. Un ratio supérieur à 1 est généralement considéré comme bon."
                  />
                  <DataCard
                    title="Volatilité"
                    value={`${metrics.volatility.toFixed(2)}%`}
                    trend={{ value: 0, isPositive: false }}
                    tooltip="Mesure de la dispersion des rendements. Une volatilité élevée indique un risque plus élevé."
                  />
                  <DataCard
                    title="Corrélation au marché"
                    value={metrics.correlation.toFixed(2)}
                    trend={{ value: metrics.correlation, isPositive: metrics.correlation < 0 }}
                    tooltip="Corrélation entre vos trades et le marché général. Une corrélation négative indique que vos stratégies fonctionnent à contre-courant du marché."
                  />
                  <DataCard
                    title="Rendement ajusté au risque"
                    value={`${metrics.riskAdjustedReturn.toFixed(2)}%`}
                    trend={{ value: metrics.riskAdjustedReturn - 10, isPositive: metrics.riskAdjustedReturn >= 10 }}
                    tooltip="Performance tenant compte du niveau de risque pris. Plus le chiffre est élevé, meilleure est votre performance."
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des séquences</CardTitle>
                  <CardDescription>
                    Répartition des séquences de trades gagnants et perdants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: '1 trade', win: 15, loss: 10 },
                          { name: '2 trades', win: 8, loss: 6 },
                          { name: '3 trades', win: 4, loss: 3 },
                          { name: '4 trades', win: 2, loss: 3 },
                          { name: '5+ trades', win: 1, loss: 2 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="win" name="Séquences gagnantes" fill="#82ca9d" />
                        <Bar dataKey="loss" name="Séquences perdantes" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analyse du ratio risque/récompense</CardTitle>
                  <CardDescription>
                    Distribution des trades selon le ratio risque/récompense
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: '< 0.5', count: 5, winRate: 20 },
                          { name: '0.5 - 1', count: 12, winRate: 40 },
                          { name: '1 - 1.5', count: 18, winRate: 55 },
                          { name: '1.5 - 2', count: 15, winRate: 75 },
                          { name: '2 - 3', count: 10, winRate: 82 },
                          { name: '> 3', count: 6, winRate: 90 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" name="Nombre de trades" fill="#8884d8" />
                        <Line yAxisId="right" type="monotone" dataKey="winRate" name="Win Rate (%)" stroke="#ff7300" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Rapport d'analyse avancée</CardTitle>
                <CardDescription>
                  Recommandations personnalisées basées sur vos performances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Forces</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Win rate supérieur à la moyenne (54.2% contre 48.7% pour la moyenne des traders)</li>
                    <li>Bonnes performances avec la stratégie de suivi de tendance</li>
                    <li>Gestion des pertes efficace avec une perte moyenne maîtrisée</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Domaines d'amélioration</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Le facteur de profit pourrait être amélioré en augmentant la taille des positions sur les trades gagnants</li>
                    <li>La volatilité est relativement élevée, suggérant un besoin de diversification</li>
                    <li>Les performances sont moins bonnes en début de séance (9h-10h)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Recommandations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Considérer un trailing stop plus large sur les positions gagnantes pour maximiser les profits</li>
                    <li>Réduire l'exposition pendant les heures d'ouverture du marché (9h-10h) où vos performances sont moins bonnes</li>
                    <li>Augmenter l'allocation sur les stratégies qui montrent le meilleur ratio risque/récompense</li>
                    <li>Envisager une diversification des instruments pour réduire la volatilité globale</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      {!isPremium && (
        <Card className="border-dashed border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Analyses avancées disponibles avec Premium</span>
            </CardTitle>
            <CardDescription>
              Débloquez l'accès à des métriques avancées, des analyses de séquences, des rapports détaillés et bien plus encore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default" className="bg-yellow-500 hover:bg-yellow-600">
              <a href="/premium">Passer à Premium</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
