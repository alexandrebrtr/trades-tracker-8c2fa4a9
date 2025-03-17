
import { DataCard } from "@/components/ui/data-card";
import { ChevronDown } from "lucide-react";

interface MaxDrawdownCardProps {
  maxDrawdown: number | null;
}

export function MaxDrawdownCard({ maxDrawdown }: MaxDrawdownCardProps) {
  if (maxDrawdown === null) return null;
  
  return (
    <DataCard
      title="Drawdown Maximum"
      value={`${maxDrawdown.toFixed(1)}%`}
      icon={<ChevronDown className="w-4 h-4" />}
      valueClassName="text-loss"
    />
  );
}
