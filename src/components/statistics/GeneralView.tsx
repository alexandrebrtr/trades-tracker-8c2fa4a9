
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceChart } from './charts/PerformanceChart';
import { WinLossDistributionChart } from './charts/WinLossDistributionChart';
import { TradeVolumeChart } from './charts/TradeVolumeChart';
import { StrategyPerformanceChart } from './charts/StrategyPerformanceChart';
import { format, subDays, subMonths, parseISO, differenceInDays } from "date-fns";
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

  // Filtrer les trades selon la période sélectionnée
  const getFilteredTrades = () => {
    if (!trades || trades.length === 0) return [];
    
    const today = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case "7d":
        startDate = subDays(today, 7);
        break;
      case "1m":
        startDate = subMonths(today, 1);
        break;
      case "3m":
        startDate = subMonths(today, 3);
        break;
      case "6m":
        startDate = subMonths(today, 6);
        break;
      case "1y":
        startDate = subMonths(today, 12);
        break;
      default:
        // "all" - pas de filtrage
        return [...trades].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }
    
    return trades
      .filter(trade => new Date(trade.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  useEffect(() => {
    if (!trades || trades.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Récupérer les trades filtrés
    const filteredTrades = getFilteredTrades();
    
    if (filteredTrades.length === 0) {
      setLoading(false);
      return;
    }

    // Process performance data with daily changes
    const dailyPerformance: Record<string, { value: number, dailyChange: number }> = {};
    let cumulativePnL = 0;
    let previousDate = '';
    let previousValue = 0;
    
    // Trier les trades par date croissante
    filteredTrades.forEach(trade => {
      const date = format(new Date(trade.date), "dd/MM/yyyy");
      
      // Si c'est la première entrée pour cette date
      if (!dailyPerformance[date]) {
        const dailyChange = previousDate ? (cumulativePnL + trade.pnl) - previousValue : trade.pnl;
        
        cumulativePnL += trade.pnl;
        dailyPerformance[date] = { 
          value: cumulativePnL,
          dailyChange 
        };
        
        previousDate = date;
        previousValue = cumulativePnL;
      } else {
        // Si on a déjà une entrée pour cette date, on met à jour
        cumulativePnL += trade.pnl;
        dailyPerformance[date].value = cumulativePnL;
        dailyPerformance[date].dailyChange += trade.pnl;
      }
    });

    // Convertir en tableau pour le graphique
    const performanceData = Object.entries(dailyPerformance).map(([date, data]) => ({
      date,
      value: data.value,
      dailyChange: data.dailyChange
    }));

    // Process trade volume data (compter le nombre de trades par jour)
    const volumeByDay: Record<string, number> = {};
    filteredTrades.forEach(trade => {
      const date = format(new Date(trade.date), "dd/MM/yyyy");
      volumeByDay[date] = (volumeByDay[date] || 0) + 1;
    });

    const volumeData = Object.entries(volumeByDay).map(([period, count]) => ({
      period,
      count
    }));

    // Process strategy performance
    const strategyPerformance: Record<string, number> = {};
    filteredTrades.forEach(trade => {
      const strategy = trade.strategy || "Non définie";
      strategyPerformance[strategy] = (strategyPerformance[strategy] || 0) + trade.pnl;
    });

    const strategyData = Object.entries(strategyPerformance)
      .map(([strategy, pnl]) => ({ strategy, pnl }))
      .sort((a, b) => b.pnl - a.pnl);

    // Calculate win/loss distribution
    const winningTrades = filteredTrades.filter(trade => trade.pnl > 0);
    const losingTrades = filteredTrades.filter(trade => trade.pnl < 0);

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
