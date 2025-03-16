
import { DataCard } from "@/components/ui/data-card";
import { BarChart, TrendingUp, Percent, Target, Wallet, ChevronDown, Clock } from "lucide-react";

interface StatsDisplayProps {
  balance: number;
  monthlyPnL: number;
  trades: any[];
}

export function StatsDisplay({ balance, monthlyPnL, trades }: StatsDisplayProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // Calculer les statistiques basées sur les trades
  const calculateStats = () => {
    if (!trades || trades.length === 0) {
      return {
        winRate: null,
        profitFactor: null,
        maxDrawdown: null,
        avgDuration: null
      };
    }

    // Nombre de trades gagnants
    const winningTrades = trades.filter(trade => trade.pnl > 0);
    const winRate = (winningTrades.length / trades.length) * 100;
    
    // Profit factor (total gains / total pertes)
    const totalGains = trades
      .filter(trade => trade.pnl > 0)
      .reduce((sum, trade) => sum + trade.pnl, 0);
    
    const totalLosses = Math.abs(
      trades
        .filter(trade => trade.pnl < 0)
        .reduce((sum, trade) => sum + trade.pnl, 0)
    );
    
    const profitFactor = totalLosses === 0 ? totalGains : totalGains / totalLosses;
    
    // Maximum drawdown (estimation simplifiée)
    // Pour une vraie simulation, il faudrait recalculer le solde après chaque trade
    const sortedPnls = [...trades].sort((a, b) => a.pnl - b.pnl);
    const maxLoss = sortedPnls[0]?.pnl || 0;
    const maxDrawdown = balance > 0 ? (Math.abs(maxLoss) / balance) * 100 : 0;
    
    // Durée moyenne des trades (si les dates sont disponibles)
    let avgDuration = null;
    if (trades[0].date) {
      const durationsInMs = trades
        .filter(trade => trade.date)
        .map(trade => {
          const entryDate = new Date(trade.date);
          // Supposons que la sortie est 1 jour après l'entrée si pas spécifiée
          const exitDate = trade.exit_date ? new Date(trade.exit_date) : new Date(entryDate.getTime() + 24 * 60 * 60 * 1000);
          return exitDate.getTime() - entryDate.getTime();
        });
      
      if (durationsInMs.length > 0) {
        const avgDurationMs = durationsInMs.reduce((sum, duration) => sum + duration, 0) / durationsInMs.length;
        // Convertir en heures et minutes
        const hours = Math.floor(avgDurationMs / (1000 * 60 * 60));
        const minutes = Math.floor((avgDurationMs % (1000 * 60 * 60)) / (1000 * 60));
        avgDuration = `${hours}h ${minutes}m`;
      }
    }
    
    return { winRate, profitFactor, maxDrawdown, avgDuration };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-fade-in">
      <DataCard
        title="Solde du portefeuille"
        value={formatCurrency(balance)}
        icon={<Wallet className="w-4 h-4" />}
        trend={monthlyPnL !== 0 ? { 
          value: Math.abs((monthlyPnL / (balance || 1)) * 100), 
          isPositive: monthlyPnL >= 0 
        } : undefined}
      />
      
      <DataCard
        title="Gains du mois"
        value={formatCurrency(monthlyPnL)}
        icon={<TrendingUp className="w-4 h-4" />}
        valueClassName={monthlyPnL >= 0 ? "text-profit" : "text-loss"}
      />
      
      {stats.winRate !== null && (
        <DataCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon={<Target className="w-4 h-4" />}
        />
      )}
      
      {stats.profitFactor !== null && (
        <DataCard
          title="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          icon={<BarChart className="w-4 h-4" />}
        />
      )}
      
      {stats.maxDrawdown !== null && (
        <DataCard
          title="Drawdown Maximum"
          value={`${stats.maxDrawdown.toFixed(1)}%`}
          icon={<ChevronDown className="w-4 h-4" />}
          valueClassName="text-loss"
        />
      )}
      
      {stats.avgDuration !== null && (
        <DataCard
          title="Durée moyenne des trades"
          value={stats.avgDuration}
          icon={<Clock className="w-4 h-4" />}
        />
      )}
      
      {trades.length === 0 && Array.from({ length: 4 }).map((_, index) => (
        <DataCard
          key={index}
          title="En attente de données"
          value="--"
          isLoading={false}
          icon={<Clock className="w-4 w-4" />}
        />
      ))}
    </div>
  );
}
