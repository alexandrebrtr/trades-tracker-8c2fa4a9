
import { DataCard } from "@/components/ui/data-card";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface DailyPnLCardProps {
  dailyPnL: number;
}

export function DailyPnLCard({ dailyPnL }: DailyPnLCardProps) {
  const { formatCurrency } = useCurrency();
  
  return (
    <DataCard
      title="Gains du jour"
      value={formatCurrency(dailyPnL)}
      icon={<TrendingUp className="w-4 h-4" />}
      valueClassName={dailyPnL >= 0 ? "text-profit" : "text-loss"}
    />
  );
}
