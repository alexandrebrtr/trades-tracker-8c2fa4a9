
import { DataCard } from "@/components/ui/data-card";
import { TrendingUp, TrendingDown, Percent, BarChart3, Target, Clock } from "lucide-react";

interface MetricsCardsProps {
  metrics: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    averageHoldingPeriod: string;
  };
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DataCard
        title="Rendement Total"
        value={`${metrics.totalReturn.toLocaleString('fr-FR')} €`}
        icon={<TrendingUp className="h-4 w-4" />}
        valueClassName="text-profit"
      />
      <DataCard
        title="Rendement Annualisé"
        value={`${metrics.annualizedReturn}%`}
        icon={<Percent className="h-4 w-4" />}
        valueClassName="text-profit"
      />
      <DataCard
        title="Ratio de Sharpe"
        value={metrics.sharpeRatio.toString()}
        icon={<BarChart3 className="h-4 w-4" />}
        tooltip="Mesure du rendement ajusté au risque. Plus élevé = meilleur."
      />
      <DataCard
        title="Drawdown Maximum"
        value={`${metrics.maxDrawdown}%`}
        icon={<TrendingDown className="h-4 w-4" />}
        valueClassName="text-loss"
        tooltip="La plus grande perte en pourcentage depuis un sommet."
      />
      <DataCard
        title="Taux de Réussite"
        value={`${metrics.winRate}%`}
        icon={<Target className="h-4 w-4" />}
      />
      <DataCard
        title="Durée Moyenne"
        value={metrics.averageHoldingPeriod}
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );
};
