
import { DataCard } from "@/components/ui/data-card";
import { Target } from "lucide-react";

interface WinRateCardProps {
  winRate: number | null;
}

export function WinRateCard({ winRate }: WinRateCardProps) {
  if (winRate === null) return null;
  
  return (
    <DataCard
      title="Win Rate"
      value={`${winRate.toFixed(1)}%`}
      icon={<Target className="w-4 h-4" />}
    />
  );
}
