
import { useState, useEffect } from 'react';

export interface TradeStats {
  winRate: number | null;
  profitFactor: number | null;
  maxDrawdown: number | null;
  avgDuration: string | null;
}

export function useTradeStats(trades: any[], balance: number): TradeStats {
  const [stats, setStats] = useState<TradeStats>({
    winRate: null,
    profitFactor: null,
    maxDrawdown: null,
    avgDuration: null
  });

  useEffect(() => {
    if (!trades || trades.length === 0) {
      setStats({
        winRate: null,
        profitFactor: null,
        maxDrawdown: null,
        avgDuration: null
      });
      return;
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
    
    setStats({ winRate, profitFactor, maxDrawdown, avgDuration });
  }, [trades, balance]);

  return stats;
}
