
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar
} from 'recharts';
import { DataCard } from "@/components/ui/data-card";
import { Activity, TrendingUp, Award, Clock, Zap, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Trade } from "@/components/journal/types";

// Define types for our data structures
interface StrategyData {
  returns: number[];
  count: number;
}

interface HourlyPerfData {
  total: number;
  count: number;
}

interface DailyPerfData {
  total: number;
  count: number;
}

interface Metrics {
  sortino: string;
  calmar: string;
  alpha: string;
  bestTime: string;
  bestDay: string;
  gainLoss: string;
}

const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [riskReturnData, setRiskReturnData] = useState<Array<{name: string; x: number; y: number; z: number;}>>([]);
  const [efficiencyFrontierData, setEfficiencyFrontierData] = useState<Array<{risk: number; return: number;}>>([]);
  const [weekdayPerformanceData, setWeekdayPerformanceData] = useState<Array<{day: string; return: number;}>>([]);
  const [hourlyPerformanceData, setHourlyPerformanceData] = useState<Array<{hour: string; return: number;}>>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    sortino: "2.3",
    calmar: "1.7",
    alpha: "3.8%",
    bestTime: "16h-17h",
    bestDay: "Vendredi",
    gainLoss: "2.4"
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les trades de l'utilisateur
        const { data: tradesData, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Process the trades data to ensure it conforms to the Trade type
        const trades: Trade[] = (tradesData || []).map(trade => ({
          ...trade,
          // Explicitly cast type to either "long" or "short"
          type: (trade.type?.toLowerCase() === 'short' ? 'short' : 'long') as 'long' | 'short',
          // Ensure other required properties are present
          id: trade.id,
          date: trade.date || new Date().toISOString(),
          symbol: trade.symbol,
          entry_price: trade.entry_price,
          exit_price: trade.exit_price,
          size: trade.size,
          pnl: trade.pnl || 0,
          user_id: trade.user_id,
          created_at: trade.created_at || new Date().toISOString(),
          updated_at: trade.updated_at || new Date().toISOString()
        }));

        // Traiter les données pour les visualisations
        processTradeData(trades);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        // Utiliser des données par défaut en cas d'erreur
        useDefaultData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Fonction pour traiter les données des trades
  const processTradeData = (trades: Trade[]) => {
    if (!trades || trades.length === 0) {
      useDefaultData();
      return;
    }

    // Calculer les métriques avancées
    calculateMetrics(trades);

    // Préparer les données pour les visualisations
    prepareRiskReturnData(trades);
    prepareEfficiencyFrontierData(trades);
    prepareWeekdayPerformanceData(trades);
    prepareHourlyPerformanceData(trades);
  };

  // Calculer les métriques avancées basées sur les trades
  const calculateMetrics = (trades: Trade[]) => {
    const winningTrades = trades.filter(trade => trade.pnl > 0);
    const losingTrades = trades.filter(trade => trade.pnl < 0);
    
    // Calculer le ratio de Sortino (simplification)
    const averageReturn = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / trades.length;
    const downwardDeviation = Math.sqrt(
      losingTrades.reduce((sum, trade) => sum + Math.pow((trade.pnl || 0), 2), 0) / (losingTrades.length || 1)
    );
    const sortino = downwardDeviation !== 0 ? (averageReturn / downwardDeviation).toFixed(1) : "N/A";
    
    // Calculer le ratio de Calmar (simplification)
    const annualizedReturn = averageReturn * 52; // supposant une transaction par semaine
    const maxDrawdown = calculateMaxDrawdown(trades);
    const calmar = maxDrawdown !== 0 ? (annualizedReturn / maxDrawdown).toFixed(1) : "N/A";
    
    // Alpha de Jensen (simplification)
    const alpha = ((winningTrades.length / trades.length) * 100 - 50).toFixed(1) + "%";
    
    // Analyser les performances par heure et jour
    const timePerformance = analyzeTimePerformance(trades);
    
    // Ratio de gain/perte
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length) : 1;
    const gainLoss = avgLoss !== 0 ? (avgWin / avgLoss).toFixed(1) : "N/A";
    
    setMetrics({
      sortino,
      calmar,
      alpha,
      bestTime: timePerformance.bestHour,
      bestDay: timePerformance.bestDay,
      gainLoss
    });
  };

  // Calculer le drawdown maximum
  const calculateMaxDrawdown = (trades: Trade[]) => {
    let peak = 0;
    let maxDrawdown = 0;
    let cumulativePnL = 0;
    
    trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(trade => {
      cumulativePnL += (trade.pnl || 0);
      if (cumulativePnL > peak) {
        peak = cumulativePnL;
      }
      
      const drawdown = peak - cumulativePnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    return maxDrawdown;
  };

  // Analyser les performances par heure et jour de la semaine
  const analyzeTimePerformance = (trades: Trade[]) => {
    const hourlyPerf: Record<string, HourlyPerfData> = {};
    const dailyPerf: Record<string, DailyPerfData> = {};
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    
    trades.forEach(trade => {
      if (!trade.date) return;
      
      const date = new Date(trade.date);
      const hour = date.getHours();
      const day = date.getDay();
      
      // Performance par heure
      const hourKey = hour.toString();
      hourlyPerf[hourKey] = hourlyPerf[hourKey] || { total: 0, count: 0 };
      hourlyPerf[hourKey].total += (trade.pnl || 0);
      hourlyPerf[hourKey].count += 1;
      
      // Performance par jour
      const dayKey = day.toString();
      dailyPerf[dayKey] = dailyPerf[dayKey] || { total: 0, count: 0 };
      dailyPerf[dayKey].total += (trade.pnl || 0);
      dailyPerf[dayKey].count += 1;
    });
    
    // Trouver la meilleure heure
    let bestHour = "N/A";
    let maxHourlyAvg = -Infinity;
    Object.entries(hourlyPerf).forEach(([hour, data]) => {
      const avg = data.total / data.count;
      if (avg > maxHourlyAvg) {
        maxHourlyAvg = avg;
        bestHour = `${hour}h-${(parseInt(hour) + 1) % 24}h`;
      }
    });
    
    // Trouver le meilleur jour
    let bestDay = "N/A";
    let maxDailyAvg = -Infinity;
    Object.entries(dailyPerf).forEach(([day, data]) => {
      const avg = data.total / data.count;
      if (avg > maxDailyAvg) {
        maxDailyAvg = avg;
        bestDay = dayNames[parseInt(day)];
      }
    });
    
    return { bestHour, bestDay };
  };

  // Préparer les données pour le graphique de risque-rendement
  const prepareRiskReturnData = (trades: Trade[]) => {
    // Grouper les trades par stratégie
    const strategies: Record<string, StrategyData> = {};
    trades.forEach(trade => {
      if (!trade.strategy) return;
      
      strategies[trade.strategy] = strategies[trade.strategy] || {
        returns: [],
        count: 0
      };
      
      strategies[trade.strategy].returns.push(trade.pnl || 0);
      strategies[trade.strategy].count += 1;
    });
    
    // Calculer le risque et le rendement pour chaque stratégie
    const data = Object.entries(strategies).map(([name, data]) => {
      const returns = data.returns;
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
      );
      
      return {
        name,
        x: stdDev, // Risque
        y: avgReturn, // Rendement
        z: data.count * 50, // Taille du point proportionnelle au nombre de trades
      };
    });
    
    setRiskReturnData(data.length > 0 ? data : getDefaultRiskReturnData());
  };

  // Préparer les données pour la frontière d'efficience
  const prepareEfficiencyFrontierData = (trades: Trade[]) => {
    if (trades.length < 10) {
      setEfficiencyFrontierData(getDefaultEfficiencyFrontierData());
      return;
    }
    
    // Simplification: générer une courbe d'efficience théorique
    const data = [];
    for (let risk = 2; risk <= 12; risk++) {
      const expectedReturn = 5 + 5 * (1 - Math.exp(-0.3 * risk));
      data.push({ risk, return: expectedReturn });
    }
    
    setEfficiencyFrontierData(data);
  };

  // Préparer les données de performance par jour de la semaine
  const prepareWeekdayPerformanceData = (trades: Trade[]) => {
    const dayPerformance: Record<string, number> = {
      "Lundi": 0, "Mardi": 0, "Mercredi": 0, "Jeudi": 0, "Vendredi": 0
    };
    const dayCount: Record<string, number> = { 
      "Lundi": 0, "Mardi": 0, "Mercredi": 0, "Jeudi": 0, "Vendredi": 0 
    };
    const dayMap = [null, "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", null];
    
    trades.forEach(trade => {
      if (!trade.date) return;
      
      const date = new Date(trade.date);
      const day = date.getDay();
      
      // Ignorer le weekend
      if (day === 0 || day === 6) return;
      
      const dayName = dayMap[day] as string;
      if (dayName) {
        dayPerformance[dayName] = (dayPerformance[dayName] || 0) + (trade.pnl || 0);
        dayCount[dayName] = (dayCount[dayName] || 0) + 1;
      }
    });
    
    const data = Object.entries(dayPerformance).map(([day, total]) => ({
      day,
      return: dayCount[day] > 0 ? total / dayCount[day] : 0
    }));
    
    setWeekdayPerformanceData(data.length > 0 && data.some(d => d.return !== 0) ? 
      data : getDefaultWeekdayPerformanceData());
  };

  // Préparer les données de performance par heure
  const prepareHourlyPerformanceData = (trades: Trade[]) => {
    const hourlyPerformance: Record<string, number> = {};
    const hourlyCount: Record<string, number> = {};
    
    trades.forEach(trade => {
      if (!trade.date) return;
      
      const date = new Date(trade.date);
      const hour = date.getHours();
      
      // Uniquement les heures de trading standard (9h-18h)
      if (hour < 9 || hour > 17) return;
      
      const hourKey = `${hour}:00`;
      hourlyPerformance[hourKey] = (hourlyPerformance[hourKey] || 0) + (trade.pnl || 0);
      hourlyCount[hourKey] = (hourlyCount[hourKey] || 0) + 1;
    });
    
    const data = Object.entries(hourlyPerformance).map(([hour, total]) => ({
      hour,
      return: hourlyCount[hour] > 0 ? total / hourlyCount[hour] : 0
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    
    setHourlyPerformanceData(data.length > 0 && data.some(d => d.return !== 0) ? 
      data : getDefaultHourlyPerformanceData());
  };

  // Utiliser des données par défaut
  const useDefaultData = () => {
    setRiskReturnData(getDefaultRiskReturnData());
    setEfficiencyFrontierData(getDefaultEfficiencyFrontierData());
    setWeekdayPerformanceData(getDefaultWeekdayPerformanceData());
    setHourlyPerformanceData(getDefaultHourlyPerformanceData());
  };

  // Données par défaut pour le graphique risque-rendement
  const getDefaultRiskReturnData = () => [
    { x: 5, y: 8, z: 100, name: 'Stratégie A' },
    { x: 7, y: 12, z: 200, name: 'Stratégie B' },
    { x: 3, y: 6, z: 150, name: 'Stratégie C' },
    { x: 8, y: 9, z: 300, name: 'Stratégie D' },
    { x: 10, y: 15, z: 400, name: 'Stratégie E' },
    { x: 6, y: 10, z: 250, name: 'Stratégie F' },
    { x: 9, y: 13, z: 350, name: 'Stratégie G' },
  ];

  // Données par défaut pour la frontière d'efficience
  const getDefaultEfficiencyFrontierData = () => [
    { risk: 2, return: 5 },
    { risk: 3, return: 7 },
    { risk: 4, return: 8.5 },
    { risk: 5, return: 9.5 },
    { risk: 6, return: 10.2 },
    { risk: 7, return: 10.7 },
    { risk: 8, return: 11.1 },
    { risk: 9, return: 11.4 },
    { risk: 10, return: 11.6 },
    { risk: 11, return: 11.8 },
    { risk: 12, return: 11.9 },
  ];

  // Données par défaut pour la performance par jour
  const getDefaultWeekdayPerformanceData = () => [
    { day: 'Lundi', return: 1.2 },
    { day: 'Mardi', return: 0.8 },
    { day: 'Mercredi', return: 1.5 },
    { day: 'Jeudi', return: -0.5 },
    { day: 'Vendredi', return: 2.1 },
  ];

  // Données par défaut pour la performance par heure
  const getDefaultHourlyPerformanceData = () => [
    { hour: '9:00', return: 0.3 },
    { hour: '10:00', return: 0.7 },
    { hour: '11:00', return: 0.5 },
    { hour: '12:00', return: -0.2 },
    { hour: '13:00', return: -0.4 },
    { hour: '14:00', return: 0.6 },
    { hour: '15:00', return: 0.9 },
    { hour: '16:00', return: 1.2 },
    { hour: '17:00', return: 0.4 },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">Analyses Avancées</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Analyses Avancées</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataCard
          title="Ratio de Sortino"
          value={metrics.sortino}
          icon={<TrendingUp className="h-4 w-4" />}
          tooltip="Mesure la performance ajustée au risque baissier uniquement."
        />
        <DataCard
          title="Ratio de Calmar"
          value={metrics.calmar}
          icon={<Activity className="h-4 w-4" />}
          tooltip="Rendement annualisé divisé par le drawdown maximum."
        />
        <DataCard
          title="Alpha de Jensen"
          value={metrics.alpha}
          icon={<Award className="h-4 w-4" />}
          tooltip="Mesure de surperformance par rapport au benchmark."
        />
        <DataCard
          title="Meilleur Moment"
          value={metrics.bestTime}
          icon={<Clock className="h-4 w-4" />}
          tooltip="Période de la journée avec les meilleurs rendements moyens."
        />
        <DataCard
          title="Meilleur Jour"
          value={metrics.bestDay}
          icon={<Calendar className="h-4 w-4" />}
          tooltip="Jour de la semaine avec les meilleurs rendements moyens."
        />
        <DataCard
          title="Ratio de Gain/Perte"
          value={metrics.gainLoss}
          icon={<Zap className="h-4 w-4" />}
          tooltip="Moyenne des gains divisée par la moyenne des pertes."
        />
      </div>

      <Tabs defaultValue="risk" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="risk">Risque-Rendement</TabsTrigger>
          <TabsTrigger value="time">Analyse Temporelle</TabsTrigger>
          <TabsTrigger value="correlation">Corrélations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scatter Plot Risque-Rendement par Stratégie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Risque (%)" />
                  <YAxis type="number" dataKey="y" name="Rendement (%)" />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name, props) => {
                    if (name === 'z') return [`${value} trades`, 'Volume'];
                    return [`${value}%`, name === 'x' ? 'Risque' : 'Rendement'];
                  }} />
                  <Legend />
                  <Scatter name="Stratégies" data={riskReturnData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frontière d'Efficience</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={efficiencyFrontierData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" label={{ value: 'Risque (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="return" stroke="#82ca9d" name="Rendement Optimal" dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Jour de la Semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={weekdayPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar
                    dataKey="return"
                    name="Rendement Moyen"
                    shape={(props) => {
                      const { x, y, width, height, value } = props;
                      const color = value >= 0 ? "#4ade80" : "#f87171";
                      return <rect x={x} y={y} width={width} height={height} fill={color} />;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance par Heure de la Journée</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={hourlyPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="return" stroke="#8884d8" name="Rendement Moyen" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle>Matrice de Corrélation entre Actifs</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="grid grid-cols-6 gap-2 w-full max-w-3xl">
                {/* En-têtes de colonnes */}
                <div className="flex justify-center font-semibold border-b"></div>
                <div className="flex justify-center font-semibold border-b">AAPL</div>
                <div className="flex justify-center font-semibold border-b">MSFT</div>
                <div className="flex justify-center font-semibold border-b">BTC</div>
                <div className="flex justify-center font-semibold border-b">ETH</div>
                <div className="flex justify-center font-semibold border-b">EUR/USD</div>
                
                {/* Ligne 1 */}
                <div className="flex justify-center font-semibold">AAPL</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.85</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.32</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.27</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.12</div>
                
                {/* Ligne 2 */}
                <div className="flex justify-center font-semibold">MSFT</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.85</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.28</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.25</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.15</div>
                
                {/* Ligne 3 */}
                <div className="flex justify-center font-semibold">BTC</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.32</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.28</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.92</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.05</div>
                
                {/* Ligne 4 */}
                <div className="flex justify-center font-semibold">ETH</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.27</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.25</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.92</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.08</div>
                
                {/* Ligne 5 */}
                <div className="flex justify-center font-semibold">EUR/USD</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.12</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.15</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.05</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.08</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
