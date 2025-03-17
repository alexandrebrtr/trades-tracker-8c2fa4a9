
import { DataCard } from "@/components/ui/data-card";
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface BalanceCardProps {
  balance: number;
  monthlyPnL: number;
}

export function BalanceCard({ balance, monthlyPnL }: BalanceCardProps) {
  return (
    <DataCard
      title="Solde du portefeuille"
      value={formatCurrency(balance)}
      icon={<Wallet className="w-4 h-4" />}
      trend={monthlyPnL !== 0 ? { 
        value: Math.abs((monthlyPnL / (balance || 1)) * 100), 
        isPositive: monthlyPnL >= 0 
      } : undefined}
    />
  );
}
