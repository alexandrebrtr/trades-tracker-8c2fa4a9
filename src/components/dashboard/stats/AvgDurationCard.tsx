
import { DataCard } from "@/components/ui/data-card";
import { Clock } from "lucide-react";

interface AvgDurationCardProps {
  avgDuration: string | null;
}

export function AvgDurationCard({ avgDuration }: AvgDurationCardProps) {
  if (avgDuration === null) return null;
  
  return (
    <DataCard
      title="Durée moyenne des trades"
      value={avgDuration}
      icon={<Clock className="w-4 h-4" />}
    />
  );
}
