
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PieChart, Pie, ResponsiveContainer, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { format, subDays, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CustomTooltip } from "../dashboard/chart/CustomTooltip";
import type { DateRange } from "react-day-picker";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

type Trade = {
  id: string;
  user_id: string;
  date: string;
  symbol: string;
  type: string;
  strategy: string;
  pnl: number;
};

type GeneralViewProps = {
  trades: Trade[];
};

type TimelineOption = {
  label: string;
  value: string;
};

const timelineOptions: TimelineOption[] = [
  { value: "7d", label: "7 jours" },
  { value: "1m", label: "1 mois" },
  { value: "3m", label: "3 mois" },
  { value: "6m", label: "6 mois" },
  { value: "1y", label: "1 an" },
  { value: "all", label: "Tout" },
  { value: "custom", label: "Personnalisé" },
];

const chartTypes = [
  { value: "types", label: "Types de trades" },
  { value: "strategies", label: "Stratégies" },
  { value: "assets", label: "Actifs" },
  { value: "drawdown", label: "Drawdown" }
];

export default function GeneralView({ trades }: GeneralViewProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string>("3m");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieChartType, setPieChartType] = useState<string>("types");
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [dailyPnLData, setDailyPnLData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPnL, setTotalPnL] = useState<number>(0);

  const processTradeData = (filteredTrades: Trade[]) => {
    if (filteredTrades.length === 0) {
      setChartData([]);
      setTotalPnL(0);
      setLoading(false);
      return;
    }
    
    let processedData: Record<string, number> = {};
    let total = 0;
    
    if (pieChartType === "types") {
      // Regrouper par type de trade
      filteredTrades.forEach(trade => {
        const type = trade.type || "Non défini";
        processedData[type] = (processedData[type] || 0) + Math.abs(trade.pnl);
        total += trade.pnl;
      });
    } else if (pieChartType === "strategies") {
      // Regrouper par stratégie
      filteredTrades.forEach(trade => {
        const strategy = trade.strategy || "Non définie";
        processedData[strategy] = (processedData[strategy] || 0) + Math.abs(trade.pnl);
        total += trade.pnl;
      });
    } else if (pieChartType === "assets") {
      // Regrouper par actif (symbole)
      filteredTrades.forEach(trade => {
        const symbol = trade.symbol || "Non défini";
        processedData[symbol] = (processedData[symbol] || 0) + Math.abs(trade.pnl);
        total += trade.pnl;
      });
    }
    
    // Convertir en tableau pour le graphique
    const chartData = Object.entries(processedData)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name,
        value,
        fill: COLORS[index % COLORS.length]
      }));
    
    setChartData(chartData);
    setTotalPnL(total);
    setLoading(false);
  };

  const processPerformanceData = (filteredTrades: Trade[]) => {
    if (filteredTrades.length === 0) {
      setPerformanceData([]);
      return;
    }
    
    // Trier les trades par date
    const sortedTrades = [...filteredTrades].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Regrouper les trades par jour
    const dailyData: Record<string, number> = {};
    
    sortedTrades.forEach(trade => {
      const date = format(new Date(trade.date), "yyyy-MM-dd");
      dailyData[date] = (dailyData[date] || 0) + trade.pnl;
    });
    
    // Créer la série de données cumulées
    let cumulativePnL = 0;
    const performanceData = Object.entries(dailyData).map(([date, pnl]) => {
      cumulativePnL += pnl;
      return {
        date: format(new Date(date), "dd/MM/yyyy"),
        pnl: cumulativePnL
      };
    });
    
    setPerformanceData(performanceData);
  };

  const processDailyPnLData = (filteredTrades: Trade[]) => {
    if (filteredTrades.length === 0) {
      setDailyPnLData([]);
      return;
    }
    
    // Regrouper les trades par jour
    const dailyData: Record<string, number> = {};
    
    filteredTrades.forEach(trade => {
      const date = format(new Date(trade.date), "yyyy-MM-dd");
      dailyData[date] = (dailyData[date] || 0) + trade.pnl;
    });
    
    // Créer la série de données
    const dailyPnLData = Object.entries(dailyData).map(([date, pnl]) => {
      return {
        date: format(new Date(date), "dd/MM/yyyy"),
        pnl: pnl,
        fill: pnl >= 0 ? "#4ade80" : "#f87171"
      };
    });
    
    // Trier par date
    dailyPnLData.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
    
    setDailyPnLData(dailyPnLData);
  };

  // Nouvelle fonction pour calculer les données de drawdown
  const calculateDrawdownData = (filteredTrades: Trade[]) => {
    if (!filteredTrades.length) return [];

    let cumulative = 0;
    let peak = 0;
    const drawdowns: any[] = [];
    
    filteredTrades.forEach(trade => {
      cumulative += trade.pnl;
      if (cumulative > peak) peak = cumulative;
      
      const drawdownPercent = peak !== 0 ? ((peak - cumulative) / peak) * 100 : 0;
      drawdowns.push({
        date: format(new Date(trade.date), "dd/MM/yyyy"),
        value: drawdownPercent
      });
    });
    
    return drawdowns;
  };

  useEffect(() => {
    setLoading(true);
    
    let startDate: Date;
    let endDate = new Date();
    
    if (selectedTimeline === "custom" && dateRange?.from) {
      startDate = dateRange.from;
      if (dateRange.to) endDate = dateRange.to;
    } else {
      switch (selectedTimeline) {
        case "7d":
          startDate = subDays(new Date(), 7);
          break;
        case "1m":
          startDate = subMonths(new Date(), 1);
          break;
        case "3m":
          startDate = subMonths(new Date(), 3);
          break;
        case "6m":
          startDate = subMonths(new Date(), 6);
          break;
        case "1y":
          startDate = subMonths(new Date(), 12);
          break;
        default:
          startDate = new Date(0);
      }
    }
    
    const filtered = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate >= startDate && tradeDate <= endDate;
    });
    
    setFilteredTrades(filtered);
    processTradeData(filtered);
    processPerformanceData(filtered);
    processDailyPnLData(filtered);
    setLoading(false);
  }, [trades, selectedTimeline, dateRange, pieChartType]);

  const TimelineSelector = () => (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedTimeline}
        onValueChange={(value) => {
          setSelectedTimeline(value);
          if (value !== "custom") {
            setDateRange({ from: undefined, to: undefined });
          }
        }}
      >
        <SelectTrigger className="w-[120px] md:w-[150px]">
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          {timelineOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTimeline === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex items-center justify-center text-sm md:text-base whitespace-nowrap",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                "Sélectionner"
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={fr}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Performance Evolution Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg md:text-xl font-semibold">Évolution des performances</CardTitle>
          <TimelineSelector />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[350px]">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    interval={Math.min(Math.floor(performanceData.length / 10), 30)}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#8884d8" 
                    fill="url(#colorPnl)" 
                    activeDot={{ r: 8 }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Distribution and Drawdown Charts Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold">Répartition des données</CardTitle>
            <div className="flex items-center space-x-2">
              <Select
                value={pieChartType}
                onValueChange={setPieChartType}
              >
                <SelectTrigger className="w-[120px] md:w-[170px]">
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <TimelineSelector />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full aspect-square">
              {loading ? (
                <Skeleton className="h-full w-full rounded-lg" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, 'Montant']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Drawdown Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold">Analyse du Drawdown</CardTitle>
            <TimelineSelector />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full aspect-square">
              {loading ? (
                <Skeleton className="h-full w-full rounded-lg" />
              ) : filteredTrades.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculateDrawdownData(filteredTrades)}>
                    <defs>
                      <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Drawdown']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ff4d4d"
                      fill="url(#colorDrawdown)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily P&L Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>P&L Journalier {new Date().getFullYear()}</CardTitle>
          <TimelineSelector />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[350px]">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : dailyPnLData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyPnLData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    interval={Math.min(Math.floor(dailyPnLData.length / 10), 30)}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }), 'P&L']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="pnl" 
                    name="P&L" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
