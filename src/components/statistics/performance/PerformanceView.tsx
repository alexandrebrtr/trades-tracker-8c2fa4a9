
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PerformanceView() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [periodLabel, setPeriodLabel] = useState("Dernier mois");
  const { 
    loading, 
    cumulativeReturnsData, 
    monthlyReturnsData, 
    volatilityData, 
    metrics 
  } = usePerformanceData(user, selectedPeriod);

  const handlePeriodChange = (period: string, label: string) => {
    setSelectedPeriod(period);
    setPeriodLabel(label);
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
        <MetricsCard
          title="Rendement Total"
          value={metrics.totalReturn}
          type="currency"
          icon="profit"
          trend="up"
          comparison="depuis le début"
        />
        <MetricsCard
          title="Rendement Annualisé"
          value={metrics.annualizedReturn}
          type="percentage"
          icon="performance"
          trend="up"
          comparison="par an"
        />
        <MetricsCard
          title="Ratio de Sharpe"
          value={metrics.sharpeRatio}
          type="number"
          icon="ratio"
          trend={metrics.sharpeRatio >= 1 ? "up" : "down"}
          comparison="risque ajusté"
        />
        <MetricsCard
          title="Drawdown Maximum"
          value={metrics.maxDrawdown}
          type="percentage"
          icon="volatility"
          trend="down"
          comparison="baisse maximale"
        />
      </div>

      <Tabs defaultValue="cumulative" className="mt-6">
        <TabsList>
          <TabsTrigger value="cumulative">Rendements Cumulés</TabsTrigger>
          <TabsTrigger value="monthly">Rendements Mensuels</TabsTrigger>
          <TabsTrigger value="volatility">Analyse de Volatilité</TabsTrigger>
        </TabsList>
        <TabsContent value="cumulative" className="pt-4">
          <CumulativeReturnsChart data={cumulativeReturnsData} />
        </TabsContent>
        <TabsContent value="monthly" className="pt-4">
          <MonthlyReturnsChart data={monthlyReturnsData} />
        </TabsContent>
        <TabsContent value="volatility" className="pt-4">
          <VolatilityChart data={volatilityData} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-xl font-semibold">{metrics.winRate}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Durée moyenne</p>
                <p className="text-xl font-semibold">{metrics.averageHoldingPeriod}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Meilleur trade</p>
                <p className="text-xl font-semibold text-green-500">+1,243 €</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pire trade</p>
                <p className="text-xl font-semibold text-red-500">-578 €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Profit Factor</p>
                <p className="text-xl font-semibold">{(metrics.totalReturn / Math.abs(metrics.maxDrawdown * 100)).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ratio Gain/Perte</p>
                <p className="text-xl font-semibold">1.85</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Corrélation marché</p>
                <p className="text-xl font-semibold">0.65</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ratio de Sortino</p>
                <p className="text-xl font-semibold">1.24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
