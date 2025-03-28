
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CumulativeReturnsChart } from "./CumulativeReturnsChart";
import { MonthlyReturnsChart } from "./MonthlyReturnsChart";
import { VolatilityChart } from "./VolatilityChart";
import { MetricsCard } from "./MetricsCard";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { useAuth } from "@/context/AuthContext";
import { Calendar, ChevronDown } from "lucide-react";
import { useTradeStats } from "@/hooks/useTradeStats";
import { useTradesFetcher } from "@/hooks/useTradesFetcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceViewProps {
  loading?: boolean;
  cumulativeReturnsData?: any[];
  monthlyReturnsData?: any[];
  volatilityData?: any[];
  metrics?: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    averageHoldingPeriod: string;
  };
}

export default function PerformanceView({
  loading: externalLoading,
  cumulativeReturnsData: externalCumulativeData,
  monthlyReturnsData: externalMonthlyData,
  volatilityData: externalVolatilityData,
  metrics: externalMetrics
}: PerformanceViewProps = {}) {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [periodLabel, setPeriodLabel] = useState("Dernier mois");
  
  // Fetch user's trades based on selected period
  const { isLoading: tradesLoading, trades } = useTradesFetcher(user?.id, selectedPeriod);
  
  // Use our enhanced trade stats hook to calculate real metrics from trades
  const tradeStats = useTradeStats(trades, 0); // Pass 0 as balance as we'll calculate from trades
  
  // Use external data or fetch from the performance data hook
  const { 
    loading: internalLoading, 
    cumulativeReturnsData: internalCumulativeData, 
    monthlyReturnsData: internalMonthlyData, 
    volatilityData: internalVolatilityData, 
    metrics: internalMetrics 
  } = usePerformanceData(externalCumulativeData ? null : user, selectedPeriod);
  
  // Prioritize external data if provided
  const loading = externalLoading !== undefined ? externalLoading : internalLoading || tradesLoading;
  const cumulativeReturnsData = externalCumulativeData || internalCumulativeData;
  const monthlyReturnsData = externalMonthlyData || internalMonthlyData;
  const volatilityData = externalVolatilityData || internalVolatilityData;
  const metrics = externalMetrics || internalMetrics;

  const handlePeriodChange = (period: string, label: string) => {
    setSelectedPeriod(period);
    setPeriodLabel(label);
  };

  const renderMetricsCard = (title: string, value: any, type: string, icon: string, trend: string, comparison: string) => {
    if (loading) {
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 mt-2" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
        </div>
      );
    }
    
    return (
      <MetricsCard
        title={title}
        value={value}
        type={type as "currency" | "percentage" | "number"}
        icon={icon as "profit" | "performance" | "ratio" | "volatility"}
        trend={trend as "up" | "down" | "neutral"}
        comparison={comparison}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance du portefeuille</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {periodLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handlePeriodChange("month", "Dernier mois")}>
              Dernier mois
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePeriodChange("quarter", "Dernier trimestre")}>
              Dernier trimestre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePeriodChange("year", "Dernière année")}>
              Dernière année
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePeriodChange("all", "Tout l'historique")}>
              Tout l'historique
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricsCard(
          "Rendement Total",
          metrics.totalReturn,
          "currency",
          "profit",
          "up",
          "depuis le début"
        )}
        {renderMetricsCard(
          "Rendement Annualisé",
          metrics.annualizedReturn,
          "percentage",
          "performance",
          "up",
          "par an"
        )}
        {renderMetricsCard(
          "Ratio de Sharpe",
          metrics.sharpeRatio,
          "number",
          "ratio",
          metrics.sharpeRatio >= 1 ? "up" : "down",
          "risque ajusté"
        )}
        {renderMetricsCard(
          "Drawdown Maximum",
          metrics.maxDrawdown,
          "percentage",
          "volatility",
          "down",
          "baisse maximale"
        )}
      </div>

      <Tabs defaultValue="cumulative" className="mt-6">
        <TabsList>
          <TabsTrigger value="cumulative">Rendements Cumulés</TabsTrigger>
          <TabsTrigger value="monthly">Rendements Mensuels</TabsTrigger>
          <TabsTrigger value="volatility">Analyse de Volatilité</TabsTrigger>
        </TabsList>
        <TabsContent value="cumulative" className="pt-4">
          {loading ? (
            <Skeleton className="w-full h-[350px]" />
          ) : (
            <CumulativeReturnsChart data={cumulativeReturnsData} />
          )}
        </TabsContent>
        <TabsContent value="monthly" className="pt-4">
          {loading ? (
            <Skeleton className="w-full h-[350px]" />
          ) : (
            <MonthlyReturnsChart data={monthlyReturnsData} />
          )}
        </TabsContent>
        <TabsContent value="volatility" className="pt-4">
          {loading ? (
            <Skeleton className="w-full h-[350px]" />
          ) : (
            <VolatilityChart data={volatilityData} />
          )}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de Trading</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Taux de réussite</p>
                  <p className="text-xl font-semibold">{tradeStats.winRate?.toFixed(1) || 0}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Durée moyenne</p>
                  <p className="text-xl font-semibold">{tradeStats.avgDuration || metrics.averageHoldingPeriod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meilleur trade</p>
                  <p className="text-xl font-semibold text-green-500">
                    +{tradeStats.bestTrade ? Math.round(tradeStats.bestTrade) : 0} €
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pire trade</p>
                  <p className="text-xl font-semibold text-red-500">
                    {tradeStats.worstTrade ? Math.round(tradeStats.worstTrade) : 0} €
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Profit Factor</p>
                  <p className="text-xl font-semibold">
                    {tradeStats.profitFactor ? tradeStats.profitFactor.toFixed(2) : 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ratio Gain/Perte</p>
                  <p className="text-xl font-semibold">
                    {tradeStats.gainLossRatio || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Corrélation marché</p>
                  <p className="text-xl font-semibold">
                    {tradeStats.marketCorrelation || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ratio de Sortino</p>
                  <p className="text-xl font-semibold">
                    {tradeStats.sortinoRatio || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
