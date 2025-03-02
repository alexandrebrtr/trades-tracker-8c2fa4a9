
import { DataCard } from "@/components/ui/data-card";
import { BarChart, TrendingUp, Percent, Target, Wallet, ChevronDown, Clock } from "lucide-react";

export function StatsDisplay() {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-fade-in">
      <DataCard
        title="Solde du portefeuille"
        value={formatCurrency(15234.75)}
        icon={<Wallet className="w-4 h-4" />}
        trend={{ value: 5.3, isPositive: true }}
      />
      
      <DataCard
        title="Gains du mois"
        value={formatCurrency(1879.50)}
        icon={<TrendingUp className="w-4 h-4" />}
        trend={{ value: 12.7, isPositive: true }}
        valueClassName="text-profit"
      />
      
      <DataCard
        title="Win Rate"
        value="68.5%"
        icon={<Target className="w-4 h-4" />}
        trend={{ value: 3.2, isPositive: true }}
      />
      
      <DataCard
        title="Profit Factor"
        value="2.14"
        icon={<BarChart className="w-4 h-4" />}
        trend={{ value: 0.23, isPositive: true }}
      />
      
      <DataCard
        title="Drawdown Maximum"
        value="8.4%"
        icon={<ChevronDown className="w-4 h-4" />}
        trend={{ value: 2.1, isPositive: false }}
        valueClassName="text-loss"
      />
      
      <DataCard
        title="Durée moyenne des trades"
        value="1h 45m"
        icon={<Clock className="w-4 h-4" />}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}
