
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CumulativeReturnsChart } from "./CumulativeReturnsChart";
import { MonthlyReturnsChart } from "./MonthlyReturnsChart";
import { VolatilityChart } from "./VolatilityChart";
import { MetricsCard } from "./MetricsCard";
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
import { useAuth } from "@/context/AuthContext";
import { processTradesData } from "@/utils/tradeDataProcessors";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [periodLabel, setPeriodLabel] = useState("Dernier mois");
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalReturn: 0,
    annualizedReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0,
    averageHoldingPeriod: "0 jours"
  });
  const [chartsData, setChartsData] = useState({
    cumulativeReturnsData: [],
    monthlyReturnsData: [],
    volatilityData: []
  });
  
  // Fetch user's trades based on selected period
  const { isLoading: tradesLoading, trades } = useTradesFetcher(user?.id, selectedPeriod);
  
  // Use our enhanced trade stats hook to calculate real metrics from trades
  const tradeStats = useTradeStats(trades, 0);
  
  // Process trades data for charts when trades update
  useEffect(() => {
    if (!tradesLoading && trades.length > 0) {
      const processedData = processTradesData(trades);
      setChartsData({
        cumulativeReturnsData: processedData.cumulativeReturnsData,
        monthlyReturnsData: processedData.monthlyReturnsData,
        volatilityData: processedData.volatilityData
      });
      setPortfolioMetrics(processedData.metrics);
    }
  }, [trades, tradesLoading]);
  
  // Prioritize external data if provided
  const loading = externalLoading !== undefined ? externalLoading : tradesLoading;
  const cumulativeReturnsData = externalCumulativeData || chartsData.cumulativeReturnsData;
  const monthlyReturnsData = externalMonthlyData || chartsData.monthlyReturnsData;
  const volatilityData = externalVolatilityData || chartsData.volatilityData;
  const metrics = externalMetrics || portfolioMetrics;

  const handlePeriodChange = (period: string, label: string) => {
    setSelectedPeriod(period);
    setPeriodLabel(label);
  };

  const renderMetricsCard = (title: string, value: any, type: string, icon: string, trend: string, comparison: string) => {
    if (loading) {
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-3 md:p-6 flex flex-col space-y-1">
            <Skeleton className="h-3 md:h-4 w-20 md:w-24" />
            <Skeleton className="h-6 md:h-8 w-14 md:w-16 mt-1 md:mt-2" />
            <Skeleton className="h-2 md:h-3 w-24 md:w-32 mt-1 md:mt-2" />
          </div>
        </div>
      );
    }
    
    return (
      <MetricsCard
        title={title}
        value={value}
        type={type as "currency" | "percentage" | "number" | "text"}
        icon={icon as "profit" | "performance" | "ratio" | "volatility"}
        trend={trend as "up" | "down" | "neutral"}
        comparison={comparison}
      />
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
        <h2 className="text-lg md:text-2xl font-bold">Performance du portefeuille</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-1 md:gap-2 w-full md:w-auto mt-2 md:mt-0">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              {periodLabel}
              <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {renderMetricsCard(
          "Rendement Total",
          metrics.totalReturn,
          "currency",
          "profit",
          metrics.totalReturn >= 0 ? "up" : "down",
          "depuis le début"
        )}
        {renderMetricsCard(
          "Rendement Annualisé",
          metrics.annualizedReturn,
          "percentage",
          "performance",
          metrics.annualizedReturn >= 0 ? "up" : "down",
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

      <Tabs defaultValue="cumulative" className="mt-4 md:mt-6">
        <TabsList className="w-full md:w-auto grid grid-cols-3 gap-1">
          <TabsTrigger value="cumulative" className="text-xs md:text-sm px-1 md:px-3">Rendements Cumulés</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs md:text-sm px-1 md:px-3">Rendements Mensuels</TabsTrigger>
          <TabsTrigger value="volatility" className="text-xs md:text-sm px-1 md:px-3">Analyse de Volatilité</TabsTrigger>
        </TabsList>
        <TabsContent value="cumulative" className="pt-3 md:pt-4">
          {loading || cumulativeReturnsData.length === 0 ? (
            <Skeleton className="w-full h-[200px] md:h-[350px]" />
          ) : (
            <div className="h-[250px] md:h-[350px]">
              <CumulativeReturnsChart data={cumulativeReturnsData} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="monthly" className="pt-3 md:pt-4">
          {loading || monthlyReturnsData.length === 0 ? (
            <Skeleton className="w-full h-[200px] md:h-[350px]" />
          ) : (
            <div className="h-[250px] md:h-[350px]">
              <MonthlyReturnsChart data={monthlyReturnsData} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="volatility" className="pt-3 md:pt-4">
          {loading || volatilityData.length === 0 ? (
            <Skeleton className="w-full h-[200px] md:h-[350px]" />
          ) : (
            <div className="h-[250px] md:h-[350px]">
              <VolatilityChart data={volatilityData} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
