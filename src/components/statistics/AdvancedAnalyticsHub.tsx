import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { supabase } from '@/integrations/supabase/client';
import { InstitutionalRatios } from './premium/InstitutionalRatios';
import { MonteCarloSimulation } from './premium/MonteCarloSimulation';
import { GreeksExposure } from './premium/GreeksExposure';
import { PerformancePatterns } from './premium/PerformancePatterns';
import CustomCharts from './CustomCharts';

interface AdvancedAnalyticsHubProps { userId: string | undefined }

export default function AdvancedAnalyticsHub({ userId }: AdvancedAnalyticsHubProps) {
  const { trades } = useTradesFetcher(userId, 'all');
  const [initialCapital, setInitialCapital] = useState(10000);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('transactions')
        .select('amount,type,date')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .limit(1);
      if (cancelled) return;
      if (data && data.length > 0 && data[0].type === 'deposit') {
        setInitialCapital(Number(data[0].amount) || 10000);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <Tabs defaultValue="ratios" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 mb-6 w-full h-auto">
        <TabsTrigger value="ratios" className="text-xs md:text-sm">Ratios institutionnels</TabsTrigger>
        <TabsTrigger value="montecarlo" className="text-xs md:text-sm">Monte Carlo</TabsTrigger>
        <TabsTrigger value="greeks" className="text-xs md:text-sm">Options & Greeks</TabsTrigger>
        <TabsTrigger value="patterns" className="text-xs md:text-sm">Patterns & Sessions</TabsTrigger>
        <TabsTrigger value="custom" className="text-xs md:text-sm">Graphiques perso</TabsTrigger>
      </TabsList>

      <TabsContent value="ratios"><InstitutionalRatios trades={trades} initialCapital={initialCapital} /></TabsContent>
      <TabsContent value="montecarlo"><MonteCarloSimulation trades={trades} initialCapital={initialCapital} /></TabsContent>
      <TabsContent value="greeks"><GreeksExposure trades={trades} /></TabsContent>
      <TabsContent value="patterns"><PerformancePatterns trades={trades} /></TabsContent>
      <TabsContent value="custom"><CustomCharts userId={userId} /></TabsContent>
    </Tabs>
  );
}
