
import { DataCard } from "@/components/ui/data-card";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface YearlyPnLCardProps {
  yearlyPnL: number;
}

export function YearlyPnLCard({ yearlyPnL }: YearlyPnLCardProps) {
  const { formatCurrency } = useCurrency();
  
  return (
    <DataCard
      title="Gains de l'année"
      value={formatCurrency(yearlyPnL)}
      icon={<TrendingUp className="w-4 h-4" />}
      valueClassName={yearlyPnL >= 0 ? "text-profit" : "text-loss"}
    />
  );
}
