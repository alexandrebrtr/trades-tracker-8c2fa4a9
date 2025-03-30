import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface AnalyticsData {
  date: string;
  value: number;
}

interface PerformanceSummaryProps {
  totalPnl: number;
  averageWin: number;
  averageLoss: number;
  winRate: number;
  lossRate: number;
}

interface AssetAllocationData {
  name: string;
  value: number;
  color: string;
}

interface TradeDistributionData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const getBarColor = (value: number): string => {
  return value >= 0 ? '#4ade80' : '#f87171';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border rounded-md p-3 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          Value: <span className="font-semibold">{typeof payload[0].value === 'number' ? payload[0].value.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
          }) : payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const timeframeOptions = [
  { value: '7d', label: '7 jours' },
  { value: '1m', label: '1 mois' },
  { value: '3m', label: '3 mois' },
  { value: '6m', label: '6 mois' },
  { value: '1y', label: 'Année' },
  { value: 'all', label: 'Tout' },
];

const AnalyticsView = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummaryProps | null>(null);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocationData[]>([]);
  const [tradesByType, setTradesByType] = useState<TradeDistributionData[]>([]);
  const [tradesByStrategy, setTradesByStrategy] = useState<TradeDistributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('3m');
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const startDate = getStartDateFromTimeframe(timeframe);
        
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });

        if (tradesError) throw tradesError;

        processTradesData(trades || []);
        
      } catch (error: any) {
        console.error('Error fetching analytics data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, timeframe]);

  const getStartDateFromTimeframe = (tf: string): Date => {
    const now = new Date();
    switch (tf) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7));
      case '1m':
        return new Date(now.setMonth(now.getMonth() - 1));
      case '3m':
        return new Date(now.setMonth(now.getMonth() - 3));
      case '6m':
        return new Date(now.setMonth(now.getMonth() - 6));
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'all':
      default:
        return new Date(2000, 0, 1);
    }
  };

  const processTradesData = (trades: any[]) => {
    if (!trades || trades.length === 0) {
      setAnalyticsData([]);
      setPerformanceSummary({
        totalPnl: 0,
        averageWin: 0,
        averageLoss: 0,
        winRate: 0,
        lossRate: 0
      });
      setAssetAllocation([]);
      setTradesByType([]);
      setTradesByStrategy([]);
      return;
    }

    const dailyReturns: Record<string, number> = {};
    trades.forEach(trade => {
      const date = new Date(trade.date).toLocaleDateString('fr-FR');
      dailyReturns[date] = (dailyReturns[date] || 0) + trade.pnl;
    });

    const analyticsData = Object.entries(dailyReturns).map(([date, value]) => ({
      date,
      value
    })).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    setAnalyticsData(analyticsData);

    const wins = trades.filter(trade => trade.pnl > 0);
    const losses = trades.filter(trade => trade.pnl < 0);
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const averageWin = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.pnl, 0) / wins.length : 0;
    const averageLoss = losses.length > 0 ? losses.reduce((sum, trade) => sum + trade.pnl, 0) / losses.length : 0;
    const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
    const lossRate = trades.length > 0 ? (losses.length / trades.length) * 100 : 0;

    setPerformanceSummary({
      totalPnl,
      averageWin,
      averageLoss,
      winRate,
      lossRate
    });

    const assets: Record<string, number> = {};
    trades.forEach(trade => {
      if (!assets[trade.symbol]) {
        assets[trade.symbol] = 0;
      }
      assets[trade.symbol] += Math.abs(trade.pnl);
    });

    const assetAllocationData = Object.entries(assets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

    setAssetAllocation(assetAllocationData);

    const tradeTypes: Record<string, number> = {};
    trades.forEach(trade => {
      const type = trade.type || 'Unknown';
      tradeTypes[type] = (tradeTypes[type] || 0) + 1;
    });

    const tradeTypesData = Object.entries(tradeTypes).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    setTradesByType(tradeTypesData);

    const strategies: Record<string, number> = {};
    trades.forEach(trade => {
      const strategy = trade.strategy || 'Non définie';
      strategies[strategy] = (strategies[strategy] || 0) + 1;
    });

    const strategiesData = Object.entries(strategies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({
        name,
        value
      }));

    setTradesByStrategy(strategiesData);
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-80" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px]" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-80" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-80" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-xl font-semibold">Vue d'ensemble des Performances</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {timeframeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Évolution des performances</span>
            {performanceSummary && (
              <Badge className={performanceSummary.totalPnl >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                {performanceSummary.totalPnl >= 0 ? "+" : ""}{performanceSummary.totalPnl.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2
                })}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="md:flex items-start justify-between py-4">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-medium text-muted-foreground">
                Statistiques générales
              </h3>
              {performanceSummary && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-sm">
                  <div>Win Rate: <span className="font-semibold text-green-500">{performanceSummary.winRate.toFixed(1)}%</span></div>
                  <div>Loss Rate: <span className="font-semibold text-red-500">{performanceSummary.lossRate.toFixed(1)}%</span></div>
                  <div>Gain moyen: <span className="font-semibold">{performanceSummary.averageWin.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}</span></div>
                  <div>Perte moyenne: <span className="font-semibold">{performanceSummary.averageLoss.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}</span></div>
                </div>
              )}
            </div>
          </div>
          
          {analyticsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>Aucune donnée de trading disponible pour cette période.</p>
              <Button variant="outline" className="mt-4" onClick={() => setTimeframe('all')}>
                Voir toutes les données
              </Button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="url(#colorPnl)" 
                  activeDot={{ r: 8 }} 
                />
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            {assetAllocation.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p>Aucune donnée sur les actifs disponible.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      value.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }),
                      "PnL total"
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="type" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="type">Par Type</TabsTrigger>
                <TabsTrigger value="strategy">Par Stratégie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="type">
                {tradesByType.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <p>Aucune donnée de trade disponible.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={tradesByType}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {tradesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} trades`, 'Nombre']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
              
              <TabsContent value="strategy">
                {tradesByStrategy.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <p>Aucune donnée de stratégie disponible.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={tradesByStrategy}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value: number) => [`${value} trades`, 'Nombre']} />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance par Jour</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <p>Aucune donnée de performance journalière disponible.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  name="Gain/Perte"
                  shape={(props) => {
                    const { x, y, width, height, value } = props;
                    const color = value >= 0 ? "#4ade80" : "#f87171";
                    
                    const baseline = props.background?.y || 0;
                    
                    if (value >= 0) {
                      return <rect x={x} y={y} width={width} height={Math.abs(height)} fill={color} />;
                    } else {
                      return <rect x={x} y={baseline} width={width} height={Math.abs(height)} fill={color} />;
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsView;
