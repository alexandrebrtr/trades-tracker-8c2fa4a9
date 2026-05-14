
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getStartDateFromTimeframe } from '@/utils/dateUtils';
import { RealtimeService } from '@/services/RealtimeService';
import { useAccount } from '@/context/AccountContext';

/**
 * Hook to fetch trade data from Supabase, scoped to the active account.
 */
export const useTradesFetcher = (userId: any, selectedPeriod: string) => {
  const { activeAccountId } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!userId || !activeAccountId) {
      setIsLoading(false);
      setTrades([]);
      return;
    }

    const fetchTrades = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const startDate = getStartDateFromTimeframe(selectedPeriod);
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .eq('account_id', activeAccountId)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });
        if (error) throw error;
        setTrades(data || []);
      } catch (err: any) {
        console.error('Error fetching trades data:', err.message);
        setError(err);
        setTrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    const subscription = RealtimeService.subscribeToTrades(userId, () => fetchTrades());
    fetchTrades();
    return () => { subscription(); };
  }, [userId, selectedPeriod, activeAccountId]);

  const syncTradesFromBroker = async (brokerSettings: { name: string; apiKey: string; secretKey: string; }) => {
    if (!userId || !brokerSettings.name || !brokerSettings.apiKey || !brokerSettings.secretKey) {
      return { success: false, error: "Informations manquantes" };
    }
    setIsSyncing(true);
    try {
      const result = await RealtimeService.syncTradesFromBroker(userId, brokerSettings);
      return result;
    } catch (err) {
      console.error('Error syncing trades:', err);
      return { success: false, error: err };
    } finally {
      setIsSyncing(false);
    }
  };

  return { isLoading, trades, error, isSyncing, syncTradesFromBroker };
};
