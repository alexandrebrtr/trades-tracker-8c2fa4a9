
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { CHART_CONFIG } from "./chartConfig";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceComparison() {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Récupérer l'historique des trades pour calculer l'évolution de la balance
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;

        if (!trades || trades.length === 0) {
          // Données par défaut si l'utilisateur n'a pas de trades
          setPerformanceData(getDefaultData());
          setLoading(false);
          return;
        }

        // Calculer l'évolution de la balance et générer les données pour le graphique
        const chartData = generatePerformanceChartData(trades);
        setPerformanceData(chartData);
      } catch (err) {
        console.error("Erreur lors du chargement des données de performance:", err);
        setPerformanceData(getDefaultData());
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  const generatePerformanceChartData = (trades: any[]) => {
    // Grouper les trades par mois pour simplifier le graphique
    const monthlyData: Record<string, { 
      portfolioValue: number, 
      benchmarkValue: number,
      date: string 
    }> = {};

    let cumulativeBalance = 0;
    let initialBalance = 0;
    let firstDate: Date | null = null;

    // Parcourir tous les trades pour calculer la balance cumulative
    trades.forEach((trade, index) => {
      const date = new Date(trade.date);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      // Si c'est le premier trade, initialiser les valeurs de départ
      if (index === 0) {
        firstDate = date;
        // La balance initiale peut être 0 ou une autre valeur selon les besoins
        initialBalance = 10000; // Valeur fictive de départ
        cumulativeBalance = initialBalance;
      }
      
      // Ajouter le PNL au cumul
      cumulativeBalance += trade.pnl || 0;
      
      // Stocker ou mettre à jour les données pour ce mois
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          portfolioValue: cumulativeBalance,
          benchmarkValue: calculateBenchmarkValue(date, firstDate!, initialBalance),
          date: monthKey
        };
      } else {
        // Mise à jour avec la dernière valeur du mois
        monthlyData[monthKey].portfolioValue = cumulativeBalance;
      }
    });

    // Convertir l'objet en tableau pour le graphique
    return Object.values(monthlyData);
  };

  // Calculer la valeur du benchmark (S&P 500) avec une croissance constante de 10% par an
  const calculateBenchmarkValue = (currentDate: Date, startDate: Date, initialValue: number) => {
    // Calculer le nombre de jours écoulés
    const daysDiff = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    // Croissance de 10% par an, convertie en croissance quotidienne
    const dailyGrowthRate = Math.pow(1.10, 1/365) - 1;
    // Calculer la valeur du benchmark
    const benchmarkValue = initialValue * Math.pow(1 + dailyGrowthRate, daysDiff);
    
    return Math.round(benchmarkValue);
  };

  const getDefaultData = () => {
    return [
      { date: "Jan", portfolioValue: 10000, benchmarkValue: 10000 },
      { date: "Fév", portfolioValue: 10800, benchmarkValue: 10200 },
      { date: "Mars", portfolioValue: 11600, benchmarkValue: 10300 },
      { date: "Avr", portfolioValue: 12200, benchmarkValue: 10400 },
      { date: "Mai", portfolioValue: 11900, benchmarkValue: 10500 },
      { date: "Juin", portfolioValue: 12400, benchmarkValue: 10600 },
      { date: "Juil", portfolioValue: 12800, benchmarkValue: 10700 },
      { date: "Août", portfolioValue: 13200, benchmarkValue: 10800 },
      { date: "Sept", portfolioValue: 13600, benchmarkValue: 10900 },
      { date: "Oct", portfolioValue: 13300, benchmarkValue: 11000 },
      { date: "Nov", portfolioValue: 13900, benchmarkValue: 11100 },
      { date: "Déc", portfolioValue: 14500, benchmarkValue: 11200 },
    ];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparaison avec le Marché (S&P 500)</CardTitle>
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
        <CardTitle>Comparaison avec le Marché (S&P 500)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`${value} €`, value === performanceData[0]?.portfolioValue ? 'Portefeuille' : 'S&P 500 (10%)']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="portfolioValue" 
              name="Portefeuille" 
              stroke={CHART_CONFIG.primary.theme.light}
              strokeWidth={2} 
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="benchmarkValue" 
              name="S&P 500 (10%)" 
              stroke={CHART_CONFIG.tertiary.theme.light}
              strokeWidth={2} 
              dot={{ r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
