
import { DataCard } from "@/components/ui/data-card";
import { BarChart } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface TotalGainsCardProps {
  totalGains: number;
}

export function TotalGainsCard({ totalGains }: TotalGainsCardProps) {
  return (
    <DataCard
      title="Gains totaux"
      value={formatCurrency(totalGains)}
      icon={<BarChart className="w-4 h-4" />}
      valueClassName={totalGains >= 0 ? "text-profit" : "text-loss"}
    />
  );
}
