
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
import { format, differenceInDays, parseISO, isValid } from "date-fns";

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
        // Récupérer l'historique des trades et des dépôts pour calculer l'évolution de la balance
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (tradesError) throw tradesError;

        // Récupérer la balance actuelle
        const { data: balanceData, error: balanceError } = await supabase
          .from('accounts')
          .select('balance, initial_balance')
          .eq('user_id', user.id)
          .single();

        if (balanceError && balanceError.code !== 'PGRST116') throw balanceError;

        // Valeur initiale de la balance
        const initialBalance = balanceData?.initial_balance || balanceData?.balance || 10000;
        const currentBalance = balanceData?.balance || initialBalance;

        // Générer les données pour le graphique
        if (!trades || trades.length === 0) {
          // Si pas de trades, créer des données simples avec uniquement la balance
          const defaultData = generateDefaultData(initialBalance);
          setPerformanceData(defaultData);
        } else {
          // Calculer l'évolution de la balance et générer les données pour le graphique
          const chartData = generatePerformanceChartData(trades, initialBalance, currentBalance);
          setPerformanceData(chartData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de performance:", err);
        const defaultData = generateDefaultData(10000);
        setPerformanceData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  const generatePerformanceChartData = (trades: any[], initialBalance: number, currentBalance: number) => {
    // Grouper les trades par mois pour simplifier le graphique
    const monthlyData: Record<string, { 
      portfolioValue: number, 
      benchmarkValue: number,
      date: string 
    }> = {};

    let cumulativeBalance = initialBalance;
    let firstDate: Date | null = null;
    let lastDate: Date = new Date();

    // Trouver la première date de trade
    const validDates = trades
      .map(trade => parseISO(trade.date))
      .filter(date => isValid(date));
    
    firstDate = validDates.length > 0 ? validDates[0] : new Date();
    lastDate = validDates.length > 0 ? validDates[validDates.length - 1] : new Date();

    // Initialiser le point de départ pour les deux courbes
    const startMonthKey = format(firstDate, 'MMM yyyy');
    monthlyData[startMonthKey] = {
      portfolioValue: initialBalance,
      benchmarkValue: initialBalance,
      date: startMonthKey
    };

    // Parcourir tous les trades pour calculer la balance cumulative
    trades.forEach((trade) => {
      const date = parseISO(trade.date);
      if (!isValid(date)) return;
      
      const monthKey = format(date, 'MMM yyyy');
      
      // Ajouter le PNL au cumul
      cumulativeBalance += trade.pnl || 0;
      
      // Stocker ou mettre à jour les données pour ce mois
      if (!monthlyData[monthKey]) {
        const daysDiff = differenceInDays(date, firstDate!);
        const benchmarkValue = calculateBenchmarkValue(date, firstDate!, initialBalance);
        
        monthlyData[monthKey] = {
          portfolioValue: cumulativeBalance,
          benchmarkValue: benchmarkValue,
          date: monthKey
        };
      } else {
        // Mise à jour avec la dernière valeur du mois
        monthlyData[monthKey].portfolioValue = cumulativeBalance;
      }
    });

    // S'assurer que la dernière valeur du portefeuille correspond à la balance actuelle
    const lastMonthKey = format(lastDate, 'MMM yyyy');
    if (monthlyData[lastMonthKey]) {
      monthlyData[lastMonthKey].portfolioValue = currentBalance;
    }

    // Convertir l'objet en tableau pour le graphique
    return Object.values(monthlyData);
  };

  // Calculer la valeur du benchmark (S&P 500) avec une croissance constante de 10% par an
  const calculateBenchmarkValue = (currentDate: Date, startDate: Date, initialValue: number) => {
    // Calculer le nombre de jours écoulés
    const daysDiff = differenceInDays(currentDate, startDate);
    if (daysDiff <= 0) return initialValue;
    
    // Croissance de 10% par an, convertie en croissance quotidienne
    const dailyGrowthRate = Math.pow(1.10, 1/365) - 1;
    // Calculer la valeur du benchmark
    const benchmarkValue = initialValue * Math.pow(1 + dailyGrowthRate, daysDiff);
    
    return Math.round(benchmarkValue * 100) / 100; // Arrondir à 2 décimales
  };

  const generateDefaultData = (initialBalance: number) => {
    const now = new Date();
    const data = [];
    const monthCount = 12;
    
    for (let i = 0; i < monthCount; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1) + i, 1);
      const daysDiff = differenceInDays(date, new Date(now.getFullYear(), now.getMonth() - (monthCount - 1), 1));
      
      // Croissance de 10% par an, convertie en croissance quotidienne
      const dailyGrowthRate = Math.pow(1.10, 1/365) - 1;
      const benchmarkValue = initialBalance * Math.pow(1 + dailyGrowthRate, daysDiff);
      
      // Pour la simulation, on suppose une croissance plus rapide pour le portefeuille
      const portfolioGrowthRate = Math.pow(1.15, 1/365) - 1;
      const portfolioValue = initialBalance * Math.pow(1 + portfolioGrowthRate, daysDiff);
      
      data.push({
        date: format(date, 'MMM yyyy'),
        portfolioValue: Math.round(portfolioValue),
        benchmarkValue: Math.round(benchmarkValue)
      });
    }
    
    return data;
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
              formatter={(value: any) => [
                new Intl.NumberFormat('fr-FR', {
                  style: 'currency', 
                  currency: 'EUR'
                }).format(value), 
                value === performanceData[0]?.benchmarkValue ? 'S&P 500 (10%)' : 'Portefeuille'
              ]}
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
