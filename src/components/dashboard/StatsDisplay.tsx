
import { BalanceCard } from "./stats/BalanceCard";
import { MonthlyPnLCard } from "./stats/MonthlyPnLCard";
import { DailyPnLCard } from "./stats/DailyPnLCard";
import { YearlyPnLCard } from "./stats/YearlyPnLCard";
import { WinRateCard } from "./stats/WinRateCard";
import { ProfitFactorCard } from "./stats/ProfitFactorCard";
import { MaxDrawdownCard } from "./stats/MaxDrawdownCard";
import { AvgDurationCard } from "./stats/AvgDurationCard";
import { LoadingCard } from "./stats/LoadingCard";
import { useTradeStats } from "@/hooks/useTradeStats";
import { useState, useEffect } from "react";

interface StatsDisplayProps {
  balance: number;
  monthlyPnL: number;
  trades: any[];
}

export function StatsDisplay({ balance, monthlyPnL, trades }: StatsDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const stats = useTradeStats(trades, balance);
  
  // Calcul des gains journaliers et annuels
  const dailyPnL = calculateDailyPnL(trades);
  const yearlyPnL = calculateYearlyPnL(trades);
  
  // Add a loading effect for better UX
  useEffect(() => {
    if (trades.length > 0) {
      // Brief loading state for smoother transition when data changes
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [trades]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 animate-fade-in">
      {/* Première rangée: les gains par périodes (jour, mois, année) */}
      <DailyPnLCard dailyPnL={dailyPnL} />
      <MonthlyPnLCard monthlyPnL={monthlyPnL} />
      <YearlyPnLCard yearlyPnL={yearlyPnL} />
      
      {/* Deuxième rangée: balance, profit factor, durée moyenne */}
      {!isLoading ? (
        <>
          <BalanceCard balance={balance} monthlyPnL={monthlyPnL} />
          <ProfitFactorCard profitFactor={stats.profitFactor} />
          <AvgDurationCard avgDuration={stats.avgDuration} />
        </>
      ) : (
        // Show loading cards while data is being processed
        Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} index={index} />
        ))
      )}
      
      {trades.length === 0 && Array.from({ length: 6 }).map((_, index) => (
        <LoadingCard key={index} index={index} />
      ))}
    </div>
  );
}

// Fonction pour calculer les gains journaliers
function calculateDailyPnL(trades: any[]): number {
  if (!trades || trades.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return trades
    .filter(trade => {
      const tradeDate = new Date(trade.date);
      tradeDate.setHours(0, 0, 0, 0);
      return tradeDate.getTime() === today.getTime();
    })
    .reduce((sum, trade) => sum + (trade.pnl || 0), 0);
}

// Fonction pour calculer les gains annuels
function calculateYearlyPnL(trades: any[]): number {
  if (!trades || trades.length === 0) return 0;
  
  const currentYear = new Date().getFullYear();
  
  return trades
    .filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getFullYear() === currentYear;
    })
    .reduce((sum, trade) => sum + (trade.pnl || 0), 0);
}
