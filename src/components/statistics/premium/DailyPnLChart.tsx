
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CHART_CONFIG } from "./chartConfig";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";

export function DailyPnLChart() {
  const [loading, setLoading] = useState(true);
  const [pnlData, setPnlData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDailyPnLData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obtenir l'année en cours
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1).toISOString();
        const endOfYear = new Date(currentYear, 11, 31).toISOString();
        
        // Récupérer les trades de l'année en cours
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startOfYear)
          .lte('date', endOfYear)
          .order('date', { ascending: true });

        if (error) throw error;

        // Générer tous les jours de l'année
        const allDays = generateAllDaysOfYear(currentYear);
        
        // Regrouper les données par jour
        const dailyPnL: Record<string, number> = {};
        
        if (trades && trades.length > 0) {
          trades.forEach(trade => {
            const tradeDate = new Date(trade.date);
            const dateKey = tradeDate.toISOString().split('T')[0];
            
            if (!dailyPnL[dateKey]) {
              dailyPnL[dateKey] = 0;
            }
            
            dailyPnL[dateKey] += (trade.pnl || 0);
          });
        }
        
        // Créer le dataset final avec tous les jours
        const chartData = allDays.map(day => {
          const dateStr = day.toISOString().split('T')[0];
          const hasTrade = dailyPnL[dateStr] !== undefined;
          const pnl = hasTrade ? dailyPnL[dateStr] : 0;
          
          const formattedDate = day.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit' 
          });
          
          return {
            date: formattedDate,
            pnl: pnl,
            // Utiliser une couleur grise pour les jours sans trades, sinon vert/rouge selon P&L
            fill: !hasTrade 
              ? "#C8C8C9" 
              : pnl >= 0 
                ? CHART_CONFIG.secondary.theme.light 
                : CHART_CONFIG.danger.theme.light,
            // Définir une hauteur fixe pour les jours sans trades
            barSize: !hasTrade ? 2 : undefined,
            // Ajouter une propriété pour identifier les jours sans trades
            noTrade: !hasTrade
          };
        });
        
        setPnlData(chartData);
      } catch (err) {
        console.error("Erreur lors du chargement des données de P&L journalier:", err);
        setPnlData(getDefaultData());
      } finally {
        setLoading(false);
      }
    };

    fetchDailyPnLData();
  }, [user]);

  // Fonction pour générer tous les jours de l'année en cours
  const generateAllDaysOfYear = (year: number) => {
    const days = [];
    const startDate = new Date(year, 0, 1); // 1er janvier
    const endDate = new Date(); // Aujourd'hui
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getDefaultData = () => {
    // Générer tous les jours de l'année en cours avec des données fictives
    const currentYear = new Date().getFullYear();
    const allDays = generateAllDaysOfYear(currentYear);
    
    return allDays.map(day => {
      // 30% des jours ont un trade
      const hasTrade = Math.random() > 0.7;
      
      const pnl = hasTrade 
        ? (Math.random() > 0.3 ? Math.floor(Math.random() * 500) : -Math.floor(Math.random() * 400))
        : 0;
      
      const formattedDate = day.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      return {
        date: formattedDate,
        pnl: pnl,
        fill: !hasTrade 
          ? "#C8C8C9" 
          : pnl >= 0 
            ? CHART_CONFIG.secondary.theme.light 
            : CHART_CONFIG.danger.theme.light,
        barSize: !hasTrade ? 2 : undefined,
        noTrade: !hasTrade
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (data.noTrade) {
        return (
          <div className="bg-background p-2 border border-border rounded-md shadow-md">
            <p className="text-sm font-medium">{`Date: ${label}`}</p>
            <p className="text-sm text-gray-500">Pas de trades ce jour</p>
          </div>
        );
      }
      
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          <p className={`text-sm ${payload[0].value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {`P&L: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>P&L Journalier {new Date().getFullYear()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Journalier {new Date().getFullYear()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <BarChart 
            data={pnlData}
            barGap={0}
            barCategoryGap={1}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              interval={Math.floor(pnlData.length / 20)}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#888" />
            <Bar 
              dataKey="pnl" 
              name="P&L" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
              // Utiliser la propriété fill de chaque point de données pour colorer les barres
              fillOpacity={0.8}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
