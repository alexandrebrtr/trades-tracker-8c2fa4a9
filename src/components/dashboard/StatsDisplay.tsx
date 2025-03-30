
import { BalanceCard } from "./stats/BalanceCard";
import { MonthlyPnLCard } from "./stats/MonthlyPnLCard";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-fade-in">
      <BalanceCard balance={balance} monthlyPnL={monthlyPnL} />
      <MonthlyPnLCard monthlyPnL={monthlyPnL} />
      
      {!isLoading ? (
        <>
          <WinRateCard winRate={stats.winRate} />
          <ProfitFactorCard profitFactor={stats.profitFactor} />
          <MaxDrawdownCard maxDrawdown={stats.maxDrawdown} />
          <AvgDurationCard avgDuration={stats.avgDuration} />
        </>
      ) : (
        // Show loading cards while data is being processed
        Array.from({ length: 4 }).map((_, index) => (
          <LoadingCard key={index} index={index} />
        ))
      )}
      
      {trades.length === 0 && Array.from({ length: 4 }).map((_, index) => (
        <LoadingCard key={index} index={index} />
      ))}
    </div>
  );
}
