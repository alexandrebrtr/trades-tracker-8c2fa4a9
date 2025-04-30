
import { DataCard } from "@/components/ui/data-card";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface MonthlyPnLCardProps {
  monthlyPnL: number;
}

export function MonthlyPnLCard({ monthlyPnL }: MonthlyPnLCardProps) {
  const { formatCurrency } = useCurrency();
  
  return (
    <DataCard
      title="Gains du mois"
      value={formatCurrency(monthlyPnL)}
      icon={<TrendingUp className="w-4 h-4" />}
      valueClassName={monthlyPnL >= 0 ? "text-profit" : "text-loss"}
    />
  );
}
