import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { useAccount } from '@/context/AccountContext';
import { MonteCarloSimulation } from './premium/MonteCarloSimulation';
import { GreeksExposure } from './premium/GreeksExposure';
import { PerformancePatterns } from './premium/PerformancePatterns';
import { QuantAnalytics } from './premium/QuantAnalytics';
import CustomCharts from './CustomCharts';

interface AdvancedAnalyticsHubProps { userId: string | undefined }

export default function AdvancedAnalyticsHub({ userId }: AdvancedAnalyticsHubProps) {
  const { trades } = useTradesFetcher(userId, 'all');
  const { activeAccount } = useAccount();
  const initialCapital = Number(activeAccount?.initial_capital) > 0
    ? Number(activeAccount!.initial_capital)
    : 10000;

  return (
    <Tabs defaultValue="montecarlo" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 mb-6 w-full h-auto">
        <TabsTrigger value="montecarlo" className="text-xs md:text-sm">Monte Carlo</TabsTrigger>
        <TabsTrigger value="greeks" className="text-xs md:text-sm">Options & Greeks</TabsTrigger>
        <TabsTrigger value="patterns" className="text-xs md:text-sm">Patterns & Sessions</TabsTrigger>
        <TabsTrigger value="quant" className="text-xs md:text-sm">Quant Analytics</TabsTrigger>
        <TabsTrigger value="custom" className="text-xs md:text-sm">Graphiques perso</TabsTrigger>
      </TabsList>

      <TabsContent value="montecarlo"><MonteCarloSimulation trades={trades} initialCapital={initialCapital} /></TabsContent>
      <TabsContent value="greeks"><GreeksExposure trades={trades} /></TabsContent>
      <TabsContent value="patterns"><PerformancePatterns trades={trades} /></TabsContent>
      <TabsContent value="quant"><QuantAnalytics trades={trades} initialCapital={initialCapital} /></TabsContent>
      <TabsContent value="custom"><CustomCharts userId={userId} /></TabsContent>
    </Tabs>
  );
}
