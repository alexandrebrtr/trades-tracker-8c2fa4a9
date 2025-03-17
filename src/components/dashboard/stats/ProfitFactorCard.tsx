
import { DataCard } from "@/components/ui/data-card";
import { BarChart } from "lucide-react";

interface ProfitFactorCardProps {
  profitFactor: number | null;
}

export function ProfitFactorCard({ profitFactor }: ProfitFactorCardProps) {
  if (profitFactor === null) return null;
  
  return (
    <DataCard
      title="Profit Factor"
      value={profitFactor.toFixed(2)}
      icon={<BarChart className="w-4 h-4" />}
    />
  );
}
