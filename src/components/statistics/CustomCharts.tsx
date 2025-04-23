
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
} from 'recharts';
import { format, subDays, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown, PieChart as PieChartIcon, LineChart as LineChartIcon, BarChart as BarChartIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DateRange } from "react-day-picker";

interface CustomChartsProps {
  userId: string | undefined;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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

const dataFieldOptions = [
  { value: "pnl", label: "Profit/Perte" },
  { value: "strategy", label: "Stratégie" },
  { value: "symbol", label: "Instrument" },
  { value: "type", label: "Type de trade" },
  { value: "date", label: "Date" },
  { value: "duration", label: "Durée" },
];

export default function CustomCharts({ userId }: CustomChartsProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string>("3m");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [chartType, setChartType] = useState<string>("bar");
  const [primaryDimension, setPrimaryDimension] = useState<string>("date");
  const [valueDimension, setValueDimension] = useState<string>("pnl");
  const [groupByDimension, setGroupByDimension] = useState<string>("none");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartName, setChartName] = useState<string>("");

  useEffect(() => {
    if (userId) {
      fetchTradeData();
    }
  }, [userId, selectedTimeline, dateRange, primaryDimension, valueDimension, groupByDimension]);

  const fetchTradeData = async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      // Déterminer la période basée sur la timeline sélectionnée
      let startDate: string | null = null;
      const now = new Date();
      
      if (selectedTimeline === "custom" && dateRange?.from && dateRange?.to) {
        startDate = dateRange.from.toISOString();
        const endDate = dateRange.to.toISOString();
        
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: true });
          
        if (error) throw error;
        
        processChartData(trades || []);
      } else {
        switch (selectedTimeline) {
          case "7d":
            startDate = subDays(now, 7).toISOString();
            break;
          case "1m":
            startDate = subMonths(now, 1).toISOString();
            break;
          case "3m":
            startDate = subMonths(now, 3).toISOString();
            break;
          case "6m":
            startDate = subMonths(now, 6).toISOString();
            break;
          case "1y":
            startDate = subMonths(now, 12).toISOString();
            break;
          default:
            startDate = null; // Tout l'historique
        }
        
        let query = supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId);
          
        if (startDate) {
          query = query.gte('date', startDate);
        }
        
        const { data: trades, error } = await query.order('date', { ascending: true });
        
        if (error) throw error;
        
        processChartData(trades || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      toast.error("Erreur lors du chargement des données");
      setChartData([]);
      setLoading(false);
    }
  };

  const processChartData = (trades: any[]) => {
    if (!trades || trades.length === 0) {
      setChartData([]);
      setLoading(false);
      return;
    }
    
    try {
      let result: any[] = [];
      
      // Si on groupe par une dimension
      if (groupByDimension !== "none") {
        const groups: Record<string, Record<string, any>> = {};
        
        trades.forEach(trade => {
          let groupValue = trade[groupByDimension]?.toString() || "Non défini";
          let primaryValue = trade[primaryDimension]?.toString() || "Non défini";
          
          // Formater la date si nécessaire
          if (primaryDimension === "date") {
            primaryValue = format(new Date(trade.date), "dd/MM/yyyy");
          }
          
          // Initialiser le groupe s'il n'existe pas
          if (!groups[primaryValue]) {
            groups[primaryValue] = { [primaryDimension]: primaryValue };
          }
          
          // Calculer la valeur pour ce groupe
          if (valueDimension === "pnl") {
            groups[primaryValue][groupValue] = (groups[primaryValue][groupValue] || 0) + trade.pnl;
          } else if (valueDimension === "count") {
            groups[primaryValue][groupValue] = (groups[primaryValue][groupValue] || 0) + 1;
          }
        });
        
        result = Object.values(groups);
      } 
      // Si on ne groupe pas
      else {
        if (primaryDimension === "date") {
          // Agrégation par jour
          const dailyData: Record<string, any> = {};
          
          trades.forEach(trade => {
            const dateStr = format(new Date(trade.date), "yyyy-MM-dd");
            
            if (!dailyData[dateStr]) {
              dailyData[dateStr] = {
                date: format(new Date(dateStr), "dd/MM/yyyy"),
                pnl: 0,
                count: 0
              };
            }
            
            if (valueDimension === "pnl") {
              dailyData[dateStr].pnl += trade.pnl;
            } else if (valueDimension === "count") {
              dailyData[dateStr].count += 1;
            }
          });
          
          result = Object.values(dailyData);
        } 
        else {
          // Agrégation par une autre dimension
          const aggregatedData: Record<string, any> = {};
          
          trades.forEach(trade => {
            const key = trade[primaryDimension]?.toString() || "Non défini";
            
            if (!aggregatedData[key]) {
              aggregatedData[key] = {
                [primaryDimension]: key,
                pnl: 0,
                count: 0
              };
            }
            
            if (valueDimension === "pnl") {
              aggregatedData[key].pnl += trade.pnl;
            } else if (valueDimension === "count") {
              aggregatedData[key].count += 1;
            }
          });
          
          result = Object.values(aggregatedData);
        }
      }
      
      // Triez les données si nécessaire
      if (primaryDimension !== "date" && chartType !== "pie") {
        result.sort((a, b) => {
          const valueField = valueDimension === "pnl" ? "pnl" : "count";
          return b[valueField] - a[valueField];
        });
      }
      
      // Limiter à 15 éléments si ce n'est pas une date
      if (primaryDimension !== "date" && result.length > 15) {
        result = result.slice(0, 15);
      }
      
      // Ajouter des couleurs pour les graphiques en barre et les camemberts
      if (chartType === "bar" || chartType === "pie") {
        result = result.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length]
        }));
      }
      
      setChartData(result);
    } catch (error) {
      console.error('Erreur lors du traitement des données:', error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const saveChart = async () => {
    if (!chartName.trim()) {
      toast.error("Veuillez donner un nom à votre graphique");
      return;
    }
    
    if (!userId) {
      toast.error("Utilisateur non identifié");
      return;
    }
    
    try {
      const chartConfig = {
        name: chartName,
        type: chartType,
        primaryDimension,
        valueDimension,
        groupByDimension,
        timeline: selectedTimeline,
        dateRange: dateRange?.from && dateRange?.to ? {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString()
        } : null
      };
      
      // Save chart configuration to Supabase
      const { error } = await supabase
        .from('custom_charts')
        .insert({
          user_id: userId,
          name: chartName,
          config: chartConfig
        });
      
      if (error) throw error;
      
      toast.success("Graphique sauvegardé avec succès");
      setChartName("");
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du graphique:', error);
      toast.error("Erreur lors de la sauvegarde du graphique");
    }
  };

  const renderChart = () => {
    if (loading) {
      return <Skeleton className="w-full h-[400px] rounded-lg" />;
    }
    
    if (chartData.length === 0) {
      return (
        <div className="w-full h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Aucune donnée disponible pour la configuration sélectionnée</p>
        </div>
      );
    }
    
    const valueField = valueDimension === "pnl" ? "pnl" : "count";
    const valueLabel = valueDimension === "pnl" ? "P&L" : "Nombre";
    
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={primaryDimension} tick={{ fontSize: 10 }} />
              <YAxis 
                tickFormatter={(value) => 
                  valueDimension === "pnl" 
                    ? new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    : value.toString()
                }
              />
              <Tooltip 
                formatter={(value) => [
                  valueDimension === "pnl"
                    ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                    : value,
                  valueLabel
                ]} 
              />
              <Legend />
              
              {groupByDimension !== "none" ? (
                // Si nous avons des données groupées
                Object.keys(chartData[0])
                  .filter(key => key !== primaryDimension && key !== 'fill')
                  .map((key, index) => (
                    <Bar 
                      key={key} 
                      dataKey={key} 
                      name={key} 
                      fill={COLORS[index % COLORS.length]} 
                      radius={[4, 4, 0, 0]}
                    />
                  ))
              ) : (
                // Si nous n'avons pas de données groupées
                <Bar 
                  dataKey={valueField} 
                  name={valueLabel} 
                  fill={chartData[0]?.fill || "#8884d8"} 
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={primaryDimension} tick={{ fontSize: 10 }} />
              <YAxis 
                tickFormatter={(value) => 
                  valueDimension === "pnl" 
                    ? new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    : value.toString()
                }
              />
              <Tooltip 
                formatter={(value) => [
                  valueDimension === "pnl"
                    ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                    : value,
                  valueLabel
                ]} 
              />
              <Legend />
              
              {groupByDimension !== "none" ? (
                // Si nous avons des données groupées
                Object.keys(chartData[0])
                  .filter(key => key !== primaryDimension && key !== 'fill')
                  .map((key, index) => (
                    <Line 
                      key={key} 
                      type="monotone"
                      dataKey={key} 
                      name={key} 
                      stroke={COLORS[index % COLORS.length]} 
                      activeDot={{ r: 8 }}
                    />
                  ))
              ) : (
                // Si nous n'avons pas de données groupées
                <Line 
                  type="monotone"
                  dataKey={valueField} 
                  name={valueLabel} 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={primaryDimension} tick={{ fontSize: 10 }} />
              <YAxis 
                tickFormatter={(value) => 
                  valueDimension === "pnl" 
                    ? new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)
                    : value.toString()
                }
              />
              <Tooltip 
                formatter={(value) => [
                  valueDimension === "pnl"
                    ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                    : value,
                  valueLabel
                ]} 
              />
              <Legend />
              
              {groupByDimension !== "none" ? (
                // Si nous avons des données groupées
                Object.keys(chartData[0])
                  .filter(key => key !== primaryDimension && key !== 'fill')
                  .map((key, index) => (
                    <Area 
                      key={key} 
                      type="monotone"
                      dataKey={key} 
                      name={key} 
                      stroke={COLORS[index % COLORS.length]} 
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={0.3}
                    />
                  ))
              ) : (
                // Si nous n'avons pas de données groupées
                <Area 
                  type="monotone"
                  dataKey={valueField} 
                  name={valueLabel} 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        // Pour le camembert, nous ne pouvons pas utiliser le groupBy, nous utilisons directement les données
        if (groupByDimension !== "none") {
          return (
            <div className="w-full h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Le graphique en camembert ne prend pas en charge le regroupement. Veuillez sélectionner 'Aucun' pour le regroupement.</p>
            </div>
          );
        }
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={valueField}
                nameKey={primaryDimension}
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [
                  valueDimension === "pnl"
                    ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                    : value,
                  valueLabel
                ]} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="w-full h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Type de graphique non pris en charge</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un graphique personnalisé</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Type de graphique</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={chartType === "bar" ? "default" : "outline"} 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => setChartType("bar")}
                      >
                        <BarChartIcon className="h-4 w-4" />
                        Barres
                      </Button>
                      <Button 
                        variant={chartType === "line" ? "default" : "outline"} 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => setChartType("line")}
                      >
                        <LineChartIcon className="h-4 w-4" />
                        Ligne
                      </Button>
                      <Button 
                        variant={chartType === "area" ? "default" : "outline"} 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => setChartType("area")}
                      >
                        <LineChartIcon className="h-4 w-4" />
                        Aire
                      </Button>
                      <Button 
                        variant={chartType === "pie" ? "default" : "outline"} 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => setChartType("pie")}
                      >
                        <PieChartIcon className="h-4 w-4" />
                        Camembert
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Dimension principale (axe X)</h3>
                    <Select value={primaryDimension} onValueChange={setPrimaryDimension}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une dimension" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataFieldOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Valeur à mesurer (axe Y)</h3>
                    <Select value={valueDimension} onValueChange={setValueDimension}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une valeur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pnl">Profit/Perte (€)</SelectItem>
                        <SelectItem value="count">Nombre de transactions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Regrouper par</h3>
                    <Select value={groupByDimension} onValueChange={setGroupByDimension}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un regroupement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        {dataFieldOptions
                          .filter(option => option.value !== primaryDimension && option.value !== "date")
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Période</h3>
                    <Select
                      value={selectedTimeline}
                      onValueChange={(value) => {
                        setSelectedTimeline(value);
                        if (value !== "custom") {
                          setDateRange({ from: undefined, to: undefined });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une période" />
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
                      <div className="mt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full flex items-center justify-center text-sm md:text-base",
                                !dateRange?.from && !dateRange?.to && "text-muted-foreground"
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
                                "Sélectionner des dates"
                              )}
                              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={2}
                              locale={fr}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sauvegarder ce graphique</h3>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Nom du graphique" 
                        value={chartName} 
                        onChange={e => setChartName(e.target.value)} 
                        className="flex-1"
                      />
                      <Button 
                        onClick={saveChart} 
                        disabled={!chartName.trim()} 
                        className="flex items-center gap-1"
                      >
                        <Save className="h-4 w-4" />
                        Sauver
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="w-full">
                {renderChart()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
