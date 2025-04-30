
import { BalanceCard } from "./stats/BalanceCard";
import { MonthlyPnLCard } from "./stats/MonthlyPnLCard";
import { DailyPnLCard } from "./stats/DailyPnLCard";
import { YearlyPnLCard } from "./stats/YearlyPnLCard";
import { WinRateCard } from "./stats/WinRateCard";
import { TotalGainsCard } from "./stats/TotalGainsCard";
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
  
  // Calculate daily and yearly PnL
  const dailyPnL = calculateDailyPnL(trades);
  const yearlyPnL = calculateYearlyPnL(trades);
  
  // Calculate total lifetime gains from all trades without any time filter
  const totalGains = calculateTotalGains(trades);
  
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
  
  // Toujours afficher exactement 6 cartes - 3 par rangée
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 animate-fade-in">
      {/* Première rangée: les gains par périodes (jour, mois, année) */}
      <DailyPnLCard dailyPnL={dailyPnL} />
      <MonthlyPnLCard monthlyPnL={monthlyPnL} />
      <YearlyPnLCard yearlyPnL={yearlyPnL} />
      
      {/* Deuxième rangée: balance, total gains, win rate - Ces cartes sont toujours affichées */}
      <BalanceCard balance={balance} monthlyPnL={monthlyPnL} />
      <TotalGainsCard totalGains={totalGains} />
      <WinRateCard winRate={stats.winRate} />
    </div>
  );
}

// Function to calculate daily PnL
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
    .reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0);
}

// Function to calculate yearly PnL
function calculateYearlyPnL(trades: any[]): number {
  if (!trades || trades.length === 0) return 0;
  
  const currentYear = new Date().getFullYear();
  
  return trades
    .filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getFullYear() === currentYear;
    })
    .reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0);
}

// Function to calculate total lifetime gains
function calculateTotalGains(trades: any[]): number {
  if (!trades || trades.length === 0) return 0;
  
  // Don't filter by year, take all trades to calculate total gains
  return trades.reduce((sum, trade) => {
    // Ensure trade.pnl is a number and handle any potential invalid values
    const pnl = Number(trade.pnl);
    return sum + (isFinite(pnl) ? pnl : 0);
  }, 0);
}
