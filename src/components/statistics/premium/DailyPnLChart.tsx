
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

        if (!trades || trades.length === 0) {
          setPnlData(getDefaultData());
          setLoading(false);
          return;
        }

        // Regrouper les données par jour
        const dailyPnL: Record<string, number> = {};
        
        trades.forEach(trade => {
          const tradeDate = new Date(trade.date);
          const dateKey = tradeDate.toISOString().split('T')[0];
          
          if (!dailyPnL[dateKey]) {
            dailyPnL[dateKey] = 0;
          }
          
          dailyPnL[dateKey] += (trade.pnl || 0);
        });
        
        // Transformer les données pour le graphique
        const chartData = Object.entries(dailyPnL).map(([date, pnl]) => {
          const formattedDate = new Date(date).toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit' 
          });
          
          return {
            date: formattedDate,
            pnl,
            // Ajouter une couleur en fonction du P&L (positif ou négatif)
            fill: pnl >= 0 ? CHART_CONFIG.success.theme.light : CHART_CONFIG.danger.theme.light
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

  const getDefaultData = () => {
    // Générer des données fictives pour les 30 derniers jours
    const data = [];
    const today = new Date();
    
    for (let i = 30; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const formattedDate = date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      const pnl = Math.random() > 0.3 
        ? Math.floor(Math.random() * 500) 
        : -Math.floor(Math.random() * 400);
      
      data.push({
        date: formattedDate,
        pnl,
        fill: pnl >= 0 ? CHART_CONFIG.success.theme.light : CHART_CONFIG.danger.theme.light
      });
    }
    
    return data;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          <BarChart data={pnlData}>
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
