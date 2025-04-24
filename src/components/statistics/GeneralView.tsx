
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceChart } from './charts/PerformanceChart';
import { WinLossDistributionChart } from './charts/WinLossDistributionChart';
import { TradeVolumeChart } from './charts/TradeVolumeChart';
import { StrategyPerformanceChart } from './charts/StrategyPerformanceChart';
import { format, subDays, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

const timelineOptions = [
  { value: "7d", label: "7 jours" },
  { value: "1m", label: "1 mois" },
  { value: "3m", label: "3 mois" },
  { value: "6m", label: "6 mois" },
  { value: "1y", label: "1 an" },
  { value: "all", label: "Tout" }
];

export default function GeneralView({ trades }: { trades: any[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState("3m");
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [tradeVolumeData, setTradeVolumeData] = useState<any[]>([]);
  const [strategyData, setStrategyData] = useState<any[]>([]);
  const [winLossData, setWinLossData] = useState({ winCount: 0, lossCount: 0 });
  const [totalGain, setTotalGain] = useState(0);

  useEffect(() => {
    if (!trades || trades.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Process performance data
    const dailyPerformance: Record<string, number> = {};
    let cumulativePnL = 0;
    
    trades.forEach(trade => {
      const date = format(new Date(trade.date), "dd/MM/yyyy");
      cumulativePnL += trade.pnl;
      dailyPerformance[date] = cumulativePnL;
    });

    const performanceData = Object.entries(dailyPerformance).map(([date, value]) => ({
      date,
      value
    }));

    // Process trade volume data
    const volumeByDay: Record<string, number> = {};
    trades.forEach(trade => {
      const date = format(new Date(trade.date), "dd/MM/yyyy");
      volumeByDay[date] = (volumeByDay[date] || 0) + 1;
    });

    const volumeData = Object.entries(volumeByDay).map(([period, count]) => ({
      period,
      count
    }));

    // Process strategy performance
    const strategyPerformance: Record<string, number> = {};
    trades.forEach(trade => {
      const strategy = trade.strategy || "Non définie";
      strategyPerformance[strategy] = (strategyPerformance[strategy] || 0) + trade.pnl;
    });

    const strategyData = Object.entries(strategyPerformance)
      .map(([strategy, pnl]) => ({ strategy, pnl }))
      .sort((a, b) => b.pnl - a.pnl);

    // Calculate win/loss distribution
    const winningTrades = trades.filter(trade => trade.pnl > 0);
    const losingTrades = trades.filter(trade => trade.pnl < 0);

    setPerformanceData(performanceData);
    setTradeVolumeData(volumeData);
    setStrategyData(strategyData);
    setWinLossData({
      winCount: winningTrades.length,
      lossCount: losingTrades.length
    });
    setTotalGain(cumulativePnL);
    setLoading(false);
  }, [trades, selectedPeriod]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Vue Générale</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {timelineOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        <PerformanceChart 
          data={performanceData}
          loading={loading}
          totalGain={totalGain}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WinLossDistributionChart
            data={winLossData}
            loading={loading}
          />
          <TradeVolumeChart
            data={tradeVolumeData}
            loading={loading}
          />
        </div>

        <StrategyPerformanceChart
          data={strategyData}
          loading={loading}
        />
      </div>
    </div>
  );
}
