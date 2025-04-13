
import { DataCard } from "@/components/ui/data-card";
import { BarChart } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface TotalGainsCardProps {
  totalGains: number;
}

export function TotalGainsCard({ totalGains }: TotalGainsCardProps) {
  // Ensure totalGains is a finite number to avoid display issues
  const safeGains = isFinite(totalGains) ? totalGains : 0;
  
  return (
    <DataCard
      title="Gains totaux"
      value={formatCurrency(safeGains)}
      icon={<BarChart className="w-4 h-4" />}
      valueClassName={safeGains >= 0 ? "text-profit" : "text-loss"}
    />
  );
}
