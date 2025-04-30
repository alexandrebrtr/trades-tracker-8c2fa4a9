
import { DataCard } from "@/components/ui/data-card";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface MonthlyPnLCardProps {
  monthlyPnL: number;
}

export function MonthlyPnLCard({ monthlyPnL }: MonthlyPnLCardProps) {
  return (
    <DataCard
      title="Gains du mois"
      value={formatCurrency(monthlyPnL)}
      icon={<TrendingUp className="w-4 h-4" />}
      valueClassName={monthlyPnL >= 0 ? "text-profit" : "text-loss"}
    />
  );
}
