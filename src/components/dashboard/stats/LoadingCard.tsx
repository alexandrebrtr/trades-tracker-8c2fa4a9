
import { DataCard } from "@/components/ui/data-card";
import { Clock } from "lucide-react";

interface LoadingCardProps {
  index: number;
}

export function LoadingCard({ index }: LoadingCardProps) {
  return (
    <DataCard
      key={index}
      title="En attente de données"
      value="--"
      isLoading={false}
      icon={<Clock className="w-4 w-4" />}
    />
  );
}
